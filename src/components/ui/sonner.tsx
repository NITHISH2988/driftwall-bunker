import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-surface text-fg shadow-border border-0 font-sans",
          description: "text-muted",
          actionButton: "bg-primary text-primary-fg",
          cancelButton: "bg-surface-2 text-fg",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
