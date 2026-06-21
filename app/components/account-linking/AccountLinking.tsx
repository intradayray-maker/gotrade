interface AccountLinkingProps {}

export default function AccountLinking({}: AccountLinkingProps) {
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Account Linking</h2>
      <p className="text-muted-foreground">Connect external broker accounts</p>
      <div className="space-y-4">
        <div className="p-4 border rounded text-center">
          <div className="font-medium">Binance</div>
          <div className="text-muted-foreground">Connect implementation pending</div>
        </div>
        <div className="p-4 border rounded text-center">
          <div className="font-medium">Other Brokers</div>
          <div className="text-muted-foreground">Additional brokers pending</div>
        </div>
      </div>
    </div>
  );
}