interface BillingProps {}

export default function Billing({}: BillingProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Billing & Subscription</h2>
      <p className="text-muted-foreground">Manage your payment methods and subscription</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">Current Plan</h3>
          <div className="text-muted-foreground">Plan details pending</div>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-medium mb-2">Payment Methods</h3>
          <div className="text-muted-foreground">Payment setup pending</div>
        </div>
      </div>
    </div>
  );
}