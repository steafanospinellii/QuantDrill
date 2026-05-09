import { useState, useEffect } from 'react';
import { Clock, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ReminderSettings() {
  const [user, setUser] = useState(null);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await base44.auth.me();
        setUser(u);
        if (u.reminder_time) setReminderTime(u.reminder_time);
        if (u.reminder_enabled !== undefined) setReminderEnabled(u.reminder_enabled);
      } catch (e) {}
    }
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await base44.auth.updateMe({
        reminder_time: reminderTime,
        reminder_enabled: reminderEnabled,
      });
    } catch (e) {
      console.error('Failed to save reminder settings:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4 py-4 bg-surface-2 border border-border rounded-2xl">
        <div className="w-9 h-9 rounded-xl bg-surface-3 flex items-center justify-center">
          <Clock size={16} className="text-primary" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-foreground">Daily Reminder</span>
          <p className="text-xs text-muted-foreground mt-0.5">Get notified to practice</p>
        </div>
      </div>

      {reminderEnabled && (
        <div className="px-4 py-3 bg-surface-2 border border-border rounded-2xl">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
            Reminder Time
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">We'll send you a reminder at this time each day</p>
        </div>
      )}

      <button
        onClick={() => setReminderEnabled(!reminderEnabled)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-surface-2 border border-border rounded-2xl text-left hover:bg-surface-3 transition-colors"
      >
        <Bell size={18} className={reminderEnabled ? 'text-primary' : 'text-muted-foreground'} />
        <span className="text-sm font-medium text-foreground">
          {reminderEnabled ? 'Reminders On' : 'Reminders Off'}
        </span>
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-2xl text-sm no-select active:scale-95 transition-transform disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}