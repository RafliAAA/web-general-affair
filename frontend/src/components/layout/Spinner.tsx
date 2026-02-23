import { Loader } from "lucide-react";

const Spinner = ({ message = "Mohon tunggu sebentar..." }) => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <Loader className="h-8 w-8 animate-spin text-primary" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default Spinner;
