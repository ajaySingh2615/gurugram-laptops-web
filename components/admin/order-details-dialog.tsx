"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, MapPin, Package, Phone, User, Calendar, CreditCard } from "lucide-react";

import type { Order } from "@/services/order.service";
import { OrderService } from "@/services/order.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdated?: () => void;
  readOnly?: boolean;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  SHIPPED: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const formatInr = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onStatusUpdated,
  readOnly = false,
}: OrderDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    try {
      setIsUpdating(true);
      await OrderService.updateOrderStatus(order.id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      onStatusUpdated?.();
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                Order Details
                <Badge variant="outline" className={statusColors[order.status] || ""}>
                  {order.status}
                </Badge>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {order.id}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Customer & Shipping */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-primary" />
                Customer Info
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {order.user?.name || order.shippingAddress.fullName}</p>
                <p><span className="text-muted-foreground">Email:</span> {order.user?.email || "N/A"}</p>
                <p><span className="text-muted-foreground">Phone:</span> {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                Shipping Address
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  Order Date
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  {format(new Date(order.createdAt), "PPp")}
                </div>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 text-sm font-medium uppercase">
                  {order.paymentMethod}
                </div>
              </div>
            </div>

            {!readOnly && (
              <div>
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2">
                  <Select
                    disabled={isUpdating}
                    value={order.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating && <Loader2 className="w-8 h-8 p-1.5 animate-spin text-muted-foreground" />}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Items */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-primary" />
              Order Items
            </h3>
            <div className="bg-muted/30 border rounded-lg overflow-hidden">
              <div className="max-h-[350px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 rounded-md bg-muted flex-shrink-0 overflow-hidden relative border shadow-sm">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title || "Product"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <h4 className="text-sm font-medium line-clamp-1">
                        {item.product?.title || "Unknown Product"}
                      </h4>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between items-center">
                        <span>
                          {item.variantName || "Standard"} x {item.quantity}
                        </span>
                        <span className="font-medium text-foreground">
                          {formatInr(Number(item.price))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="p-4 bg-muted/50 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatInr(Number(order.totalAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatInr(Number(order.totalAmount))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
