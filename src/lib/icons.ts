import { createElement } from "react";
import {
  Bot,
  Building2,
  BarChart3,
  Contact,
  FileSearch,
  GraduationCap,
  Headset,
  HeartPulse,
  Kanban,
  MessageSquare,
  MessagesSquare,
  PenTool,
  Scale,
  ScanText,
  Send,
  Shield,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  PenTool,
  Kanban,
  MessageSquare,
  HeartPulse,
  GraduationCap,
  Send,
  Building2,
  Shield,
  Users,
  ShoppingBag,
  FileSearch,
  Scale,
  Bot,
  MessagesSquare,
  ScanText,
  Sparkles,
  Contact,
  Workflow,
  BarChart3,
  TrendingUp,
  Headset,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}

export function AppIcon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  return createElement(iconMap[name] ?? Sparkles, {
    className,
    strokeWidth,
    "aria-hidden": true,
  });
}
