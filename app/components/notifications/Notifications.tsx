interface NotificationsProps {}

export default function Notifications({}: NotificationsProps) {
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      <p className="text-muted-foreground">Customize your notification preferences</p>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-medium">Trade Alerts</div>
            <div className="text-sm text-muted-foreground">Get notified of trade executions</div>
          </div>
          <div className="text-muted-foreground">Toggle pending</div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-medium">Market Updates</div>
            <div className="text-sm text-muted-foreground">Receive market news and updates</div>
          </div>
          <div className="text-muted-foreground">Toggle pending</div>
        </div>
      </div>
    </div>
  );
}