"use client";

import { useState } from "react";
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  Sparkles,
  Loader2,
  DollarSign,
  Layers,
  Crown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface PlanFormData {
  name: string;
  description: string;
  type: "individual" | "team" | "enterprise";
  billingCycle: "monthly" | "yearly";
  price: number;
  currency: "USD" | "BDT";
  features: string[];
  isActive: boolean;
}

export default function PlansManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    description: "",
    type: "individual",
    billingCycle: "monthly",
    price: 0,
    currency: "USD",
    features: [""],
    isActive: true,
  });

  const { data, isLoading, refetch } = useGetPlansQuery(undefined);
  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();

  const plans = data?.data || [];

  const handleCreate = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price < 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const filteredFeatures = formData.features.filter((f) => f.trim() !== "");
    if (filteredFeatures.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    try {
      await createPlan({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        billingCycle: formData.billingCycle,
        features: filteredFeatures,
      }).unwrap();

      toast.success("Plan created successfully");
      setIsCreateOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create plan");
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      type: plan.type,
      billingCycle: plan.billingCycle,
      price: plan.price,
      currency: plan.currency,
      features: plan.features || [""],
      isActive: plan.isActive !== false,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPlan || !formData.name.trim() || formData.price < 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const filteredFeatures = formData.features.filter((f) => f.trim() !== "");
    if (filteredFeatures.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    try {
      await updatePlan({
        id: editingPlan._id,
        data: {
          ...formData,
          features: filteredFeatures,
        },
      }).unwrap();

      toast.success("Plan updated successfully");
      setIsEditOpen(false);
      setEditingPlan(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update plan");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "individual",
      billingCycle: "monthly",
      price: 0,
      currency: "USD",
      features: [""],
      isActive: true,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const PlanForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Plan Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Pro Plan"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="e.g., Best for professionals"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Plan Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="billingCycle">Billing Cycle *</Label>
          <Select
            value={formData.billingCycle}
            onValueChange={(value: any) =>
              setFormData({ ...formData, billingCycle: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="currency">Currency *</Label>
          <Select
            value={formData.currency}
            onValueChange={(value: any) =>
              setFormData({ ...formData, currency: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="BDT">BDT (৳)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
        />
        <Label htmlFor="isActive">Active Plan</Label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Features *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Feature
          </Button>
        </div>

        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Enter feature"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1"
              />
              {formData.features.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-pink-500/20 border border-emerald-500/30">
              <Layers className="h-7 w-7 text-emerald-500" />
            </div>
            Plan Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage subscription plans
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-emerald-600 to-pink-600 hover:from-emerald-700 hover:to-pink-700 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl border-2 border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-pink-500/20">
                  <Plus className="h-4 w-4 text-emerald-500" />
                </div>
                Create New Plan
              </DialogTitle>
              <DialogDescription>Add a new subscription plan</DialogDescription>
            </DialogHeader>
            <PlanForm />
            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-pink-600 hover:from-emerald-700 hover:to-pink-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl rounded-2xl border-2 border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <Edit className="h-4 w-4 text-blue-500" />
                </div>
                Edit Plan
              </DialogTitle>
              <DialogDescription>Update plan details</DialogDescription>
            </DialogHeader>
            <PlanForm />
            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setIsEditOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updating}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card className="rounded-2xl border-2 border-border/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-pink-500/20 border border-emerald-500/30">
                <Sparkles className="h-8 w-8 text-emerald-500" />
              </div>
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin absolute -bottom-1 -right-1" />
            </div>
            <p className="mt-4 text-lg font-medium">Loading plans...</p>
            <p className="text-muted-foreground text-sm">
              Please wait while we fetch your plans
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan: any) => (
            <Card
              key={plan._id}
              className="relative rounded-2xl border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500/30"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-pink-500/20">
                        <Crown className="h-4 w-4 text-emerald-500" />
                      </div>
                      {plan.name}
                      {!plan.isActive && (
                        <Badge variant="secondary" className="rounded-lg">
                          Inactive
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <Badge variant="outline" className="rounded-lg">
                        {plan.type}
                      </Badge>
                      <Badge variant="outline" className="ml-2 rounded-lg">
                        {plan.billingCycle}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl hover:bg-emerald-500/10"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4 flex items-baseline gap-1">
                  <span className="text-lg text-muted-foreground">
                    {plan.currency === "USD" ? "$" : "৳"}
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-pink-600 bg-clip-text text-transparent">
                    {plan.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground font-normal">
                    /{plan.billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                {plan.stripePriceId && (
                  <p className="text-xs text-muted-foreground mb-4 bg-muted/50 rounded-lg px-2 py-1">
                    Stripe: {plan.stripePriceId.slice(0, 20)}...
                  </p>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    Features:
                  </p>
                  {plan.features && plan.features.length > 0 ? (
                    <ul className="space-y-2">
                      {plan.features.map((feature: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm flex items-start gap-2"
                        >
                          <div className="p-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mt-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No features listed
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
