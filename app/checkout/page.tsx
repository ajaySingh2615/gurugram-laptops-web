"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CheckCircle2, MapPin, Truck, CreditCard, ShieldCheck, Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { OrderService } from "@/services/order.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

const formatInr = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isInitialized, isAuthenticated } = useAuthStore();
  const { items, getCartTotal, clearCart } = useCartStore();
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const form = useForm<ShippingFormValues>({
    // @ts-expect-error - mismatch between zod versions in Next.js app router
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    },
  });

  // Pre-fill user data if available
  useEffect(() => {
    if (user?.fullName) {
      form.setValue("fullName", user.fullName);
    }
  }, [user, form]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      toast.error("Please log in to checkout");
      router.push("/login?redirect=/checkout");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          You have no items in your cart to checkout. Let&apos;s go find some great products!
        </p>
        <Button size="lg" className="w-full" onClick={() => router.push("/shop")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500
  const total = subtotal + shipping;

  const onSubmit = async (data: ShippingFormValues) => {
    try {
      setIsPlacingOrder(true);
      const order = await OrderService.createOrder(data);
      clearCart();
      setOrderSuccess(true);
      toast.success(order.message || "Order placed successfully!");
      // Optionally redirect to an order history page after a delay
      setTimeout(() => {
        router.push("/shop"); // Or /my-orders
      }, 3000);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Thank you for your purchase. Your order is being processed and will be shipped soon.
        </p>
        <Button size="lg" onClick={() => router.push("/shop")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen pb-20">
      {/* Checkout Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Secure Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Shipping Address */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm font-bold">1</div>
                  Shipping Address
                </CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Apt 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Mumbai" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Maharashtra" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="400001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm font-bold">2</div>
                  Payment Method
                </CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup defaultValue="cod" className="grid gap-4">
                  <div>
                    <Label
                      htmlFor="cod"
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer bg-background hover:bg-muted/50 border-primary ring-1 ring-primary/20"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <div>
                          <p className="font-semibold text-base">Cash on Delivery (COD)</p>
                          <p className="text-sm text-muted-foreground">Pay when your order arrives.</p>
                        </div>
                      </div>
                      <Truck className="w-6 h-6 text-muted-foreground" />
                    </Label>
                  </div>
                  
                  <div>
                    <Label
                      htmlFor="card"
                      className="flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" disabled />
                        <div>
                          <p className="font-semibold text-base">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Coming soon...</p>
                        </div>
                      </div>
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <Card className="border-border/50 shadow-lg shadow-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-16 w-16 rounded-md bg-muted flex-shrink-0 overflow-hidden relative border">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                          <h4 className="text-sm font-medium line-clamp-1">{item.product?.title}</h4>
                          <div className="text-xs text-muted-foreground mt-1 flex justify-between items-center">
                            <span>{item.variantName || 'Standard'} x {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatInr(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{shipping === 0 ? "Free" : formatInr(shipping)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-end">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatInr(total)}</span>
                  </div>

                </CardContent>
                <CardFooter className="flex-col gap-4 bg-muted/20 pt-6">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-semibold shadow-md"
                    type="submit"
                    form="checkout-form"
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Secure encrypted checkout
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
