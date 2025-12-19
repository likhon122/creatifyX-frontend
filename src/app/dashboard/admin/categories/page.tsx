"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
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
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";

interface FilterOption {
  displayName: string;
  value: string;
}

interface AvailableFilter {
  filterKey: string;
  displayName: string;
  options: FilterOption[];
}

interface CategoryFormData {
  name: string;
  parentCategory: boolean;
  subCategories: string[];
  availableFilters: AvailableFilter[];
}

// Move CategoryForm outside to prevent recreation on every render
const CategoryForm = ({
  formData,
  setFormData,
  categories,
  addFilter,
  removeFilter,
  addFilterOption,
  removeFilterOption,
}: {
  formData: CategoryFormData;
  setFormData: (data: CategoryFormData) => void;
  categories: any[];
  addFilter: () => void;
  removeFilter: (index: number) => void;
  addFilterOption: (filterIndex: number) => void;
  removeFilterOption: (filterIndex: number, optionIndex: number) => void;
}) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="name">Category Name *</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter category name"
        autoComplete="off"
      />
    </div>

    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="isParent"
        checked={formData.parentCategory}
        onChange={(e) =>
          setFormData({
            ...formData,
            parentCategory: e.target.checked,
          })
        }
        className="h-4 w-4"
      />
      <Label htmlFor="isParent">Is Parent Category (Main Category)</Label>
    </div>

    {formData.parentCategory && (
      <div>
        <Label>Sub Categories</Label>
        <Select
          value="select"
          onValueChange={(value) => {
            if (value !== "select" && !formData.subCategories.includes(value)) {
              setFormData({
                ...formData,
                subCategories: [...formData.subCategories, value],
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Add sub-category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="select">Select a sub-category</SelectItem>
            {categories
              .filter(
                (cat: any) =>
                  cat.categoryType === "sub_category" &&
                  !formData.subCategories.includes(cat._id)
              )
              .map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {formData.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.subCategories.map((subId) => {
              const subCat = categories.find((c: any) => c._id === subId);
              return (
                <Badge key={subId} variant="secondary" className="px-2 py-1">
                  {subCat?.name || subId}
                  <button
                    type="button"
                    className="ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        subCategories: formData.subCategories.filter(
                          (id) => id !== subId
                        ),
                      })
                    }
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    )}

    <div>
      <div className="flex justify-between items-center mb-2">
        <Label>Available Filters</Label>
        <Button type="button" size="sm" onClick={addFilter}>
          <Plus className="h-4 w-4 mr-1" />
          Add Filter
        </Button>
      </div>

      {formData.availableFilters.map((filter, filterIndex) => (
        <Card key={filterIndex} className="p-4 mb-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Filter Key</Label>
                <Input
                  value={filter.filterKey}
                  onChange={(e) => {
                    const newFilters = [...formData.availableFilters];
                    newFilters[filterIndex].filterKey = e.target.value;
                    setFormData({ ...formData, availableFilters: newFilters });
                  }}
                  placeholder="e.g., software"
                  autoComplete="off"
                />
              </div>
              <div className="flex-1">
                <Label>Display Name</Label>
                <Input
                  value={filter.displayName}
                  onChange={(e) => {
                    const newFilters = [...formData.availableFilters];
                    newFilters[filterIndex].displayName = e.target.value;
                    setFormData({ ...formData, availableFilters: newFilters });
                  }}
                  placeholder="e.g., Software"
                  autoComplete="off"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFilter(filterIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm">Filter Options</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addFilterOption(filterIndex)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Option
                </Button>
              </div>

              {filter.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2 mb-2">
                  <Input
                    value={option.value}
                    onChange={(e) => {
                      const newFilters = [...formData.availableFilters];
                      newFilters[filterIndex].options[optionIndex].value =
                        e.target.value;
                      setFormData({
                        ...formData,
                        availableFilters: newFilters,
                      });
                    }}
                    placeholder="Value (e.g., photoshop)"
                    autoComplete="off"
                  />
                  <Input
                    value={option.displayName}
                    onChange={(e) => {
                      const newFilters = [...formData.availableFilters];
                      newFilters[filterIndex].options[optionIndex].displayName =
                        e.target.value;
                      setFormData({
                        ...formData,
                        availableFilters: newFilters,
                      });
                    }}
                    placeholder="Display (e.g., Adobe Photoshop)"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilterOption(filterIndex, optionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default function CategoriesManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    parentCategory: true,
    subCategories: [],
    availableFilters: [],
  });

  const { data, isLoading, refetch } = useGetCategoriesQuery(undefined);
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

  const categories = data?.data || [];
  const mainCategories = categories.filter(
    (cat: any) => cat.categoryType === "main_category"
  );

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const payload: any = {
        name: formData.name,
        parentCategory: formData.parentCategory,
      };

      // Only include subCategories if parent category and has items
      if (formData.parentCategory && formData.subCategories.length > 0) {
        payload.subCategories = formData.subCategories;
      }

      // Only include availableFilters if it has items
      if (formData.availableFilters.length > 0) {
        payload.availableFilters = formData.availableFilters;
      }

      await createCategory(payload).unwrap();

      toast.success("Category created successfully");
      setIsCreateOpen(false);
      setFormData({
        name: "",
        parentCategory: true,
        subCategories: [],
        availableFilters: [],
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentCategory: category.parentCategory || false,
      subCategories: category.subCategories || [],
      availableFilters: category.availableFilters || [],
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const payload: any = {
        name: formData.name,
        parentCategory: formData.parentCategory,
      };

      // Only include subCategories if parent category and has items
      if (formData.parentCategory && formData.subCategories.length > 0) {
        payload.subCategories = formData.subCategories;
      }

      // Only include availableFilters if it has items
      if (formData.availableFilters.length > 0) {
        payload.availableFilters = formData.availableFilters;
      }

      await updateCategory({
        id: editingCategory._id,
        data: payload,
      }).unwrap();

      toast.success("Category updated successfully");
      setIsEditOpen(false);
      setEditingCategory(null);
      setFormData({
        name: "",
        parentCategory: true,
        subCategories: [],
        availableFilters: [],
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update category");
    }
  };

  const addFilter = () => {
    setFormData({
      ...formData,
      availableFilters: [
        ...formData.availableFilters,
        { filterKey: "", displayName: "", options: [] },
      ],
    });
  };

  const updateFilter = (
    index: number,
    field: keyof AvailableFilter,
    value: any
  ) => {
    const newFilters = [...formData.availableFilters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFormData({ ...formData, availableFilters: newFilters });
  };

  const removeFilter = (index: number) => {
    const newFilters = formData.availableFilters.filter((_, i) => i !== index);
    setFormData({ ...formData, availableFilters: newFilters });
  };

  const addFilterOption = (filterIndex: number) => {
    const newFilters = [...formData.availableFilters];
    newFilters[filterIndex].options.push({ displayName: "", value: "" });
    setFormData({ ...formData, availableFilters: newFilters });
  };

  const updateFilterOption = (
    filterIndex: number,
    optionIndex: number,
    field: keyof FilterOption,
    value: string
  ) => {
    const newFilters = [...formData.availableFilters];
    newFilters[filterIndex].options[optionIndex] = {
      ...newFilters[filterIndex].options[optionIndex],
      [field]: value,
    };
    setFormData({ ...formData, availableFilters: newFilters });
  };

  const removeFilterOption = (filterIndex: number, optionIndex: number) => {
    const newFilters = [...formData.availableFilters];
    newFilters[filterIndex].options = newFilters[filterIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData({ ...formData, availableFilters: newFilters });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderTree className="h-8 w-8" />
            Category Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage asset categories
          </p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          modal={false}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category with filters
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              addFilter={addFilter}
              removeFilter={removeFilter}
              addFilterOption={addFilterOption}
              removeFilterOption={removeFilterOption}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen} modal={false}>
          <DialogContent
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category details</DialogDescription>
            </DialogHeader>
            <CategoryForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              addFilter={addFilter}
              removeFilter={removeFilter}
              addFilterOption={addFilterOption}
              removeFilterOption={removeFilterOption}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updating}>
                {updating ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any) => (
            <Card key={category._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge
                        variant={
                          category.categoryType === "main_category"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {category.categoryType === "main_category"
                          ? "Main"
                          : "Sub"}
                      </Badge>
                      {category.parentCategory && (
                        <span className="ml-2 text-xs">
                          Parent: {category.parentCategory.name}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {category.availableFilters &&
                  category.availableFilters.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Available Filters:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.availableFilters.map(
                          (filter: AvailableFilter, idx: number) => (
                            <Badge key={idx} variant="outline">
                              {filter.displayName}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
