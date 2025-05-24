
import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
);

export function useSidebarContext() {
  const context = React.useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }

  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState<boolean>(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

const sidebarVariants = cva(
  "group relative flex h-full flex-col overflow-y-auto bg-background data-[collapsed=true]:w-[--collapsed-width] data-[collapsed=false]:w-[--expanded-width] transition-all duration-300",
  {
    variants: {
      collapsed: {
        true: "w-[var(--collapsed-width)]",
        false: "w-[var(--expanded-width)]",
      },
    },
  }
);

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean;
  collapsedWidth?: string;
  expandedWidth?: string;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      defaultCollapsed = false,
      collapsedWidth = "5rem",
      expandedWidth = "16rem",
      ...props
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState<boolean>(defaultCollapsed);

    return (
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <aside
          ref={ref}
          className={cn(sidebarVariants({ collapsed, className }))}
          data-collapsed={collapsed}
          style={{
            "--collapsed-width": collapsedWidth,
            "--expanded-width": expandedWidth,
          } as React.CSSProperties}
          {...props}
        />
      </SidebarContext.Provider>
    );
  }
);

Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebarContext();

  return (
    <div
      ref={ref}
      data-collapsed={collapsed}
      className={cn(
        "flex h-14 items-center border-b px-4 transition-all duration-300 data-[collapsed=true]:justify-center data-[collapsed=false]:justify-start",
        className
      )}
      {...props}
    />
  );
});

SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  );
});

SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-t", className)}
      {...props}
    />
  );
});

SidebarFooter.displayName = "SidebarFooter";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      <span className="sr-only">Toggle Sidebar</span>
      {collapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-3 py-2", className)}
      {...props}
    />
  );
});

SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebarContext();

  return (
    <p
      ref={ref}
      data-collapsed={collapsed}
      className={cn(
        "mb-2 px-2 text-xs text-muted-foreground transition-opacity duration-300 data-[collapsed=true]:opacity-0",
        className
      )}
      {...props}
    />
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-1", className)} {...props} />;
});

SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return <ul ref={ref} className={cn("grid gap-1", className)} {...props} />;
});

SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return <li ref={ref} className={cn("", className)} {...props} />;
});

SidebarMenuItem.displayName = "SidebarMenuItem";

// Create a type for the Slot component props
type SlotProps = {
  children?: React.ReactNode;
  [key: string]: any;
};

// Helper function to merge refs
function mergeRefs(refs: React.Ref<any>[]) {
  return (value: any) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<any>).current = value;
      }
    });
  };
}

// Export Slot since it's used in SidebarMenuButton
const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length === 0) return null;
    
    const child = childrenArray[0] as React.ReactElement;

    if (React.isValidElement(child)) {
      // Create a ref callback that merges the forwarded ref with the child's ref
      const childRef = (child as any).ref;
      const combinedRef = ref ? mergeRefs([ref, childRef]) : childRef;
      
      // Use manual prop merging instead of spreads to avoid TypeScript errors
      const combinedProps: Record<string, any> = {};
      
      // Add props from the Slot component
      if (props) {
        Object.keys(props).forEach(key => {
          combinedProps[key] = props[key];
        });
      }
      
      // Add props from the child, overriding any from the Slot
      if (child.props) {
        Object.keys(child.props).forEach(key => {
          combinedProps[key] = child.props[key];
        });
      }
      
      // Set the combined ref
      combinedProps.ref = combinedRef;
      
      return React.cloneElement(child, combinedProps);
    }

    return null;
  }
);

Slot.displayName = "Slot";

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { collapsed } = useSidebarContext();
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        data-collapsed={collapsed}
        className={cn(
          "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Slot,
};
