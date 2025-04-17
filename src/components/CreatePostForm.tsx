"use client";

import { createPost, CreatePostFormState } from "@/lib/actions";
import { useState, useRef, useEffect, useActionState } from "react";
import { Button } from "./ui/Button";
import { useFormStatus } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, CheckCircle, PlusCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Link from "next/link";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { Label } from "./ui/label";

type Community = {
  id: string;
  name: string;
  imageUrl: string | null;
};

type ImagePreview = {
  file: File;
  url: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Creating Post..." : "Create Post"}
    </Button>
  );
}

export default function CreatePostForm({
  communities,
  communityName,
}: {
  communities: Community[];
  communityName: string;
}) {
  const [medicineLinks, setMedicineLinks] = useState<string[]>([""]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [formKey, setFormKey] = useState(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState: CreatePostFormState = null;
  const [state, formAction] = useActionState(createPost, initialState);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPreviews: ImagePreview[] = [];
    const currentCount = imagePreviews.length;
    const allowedNewCount = 3 - currentCount;

    for (let i = 0; i < Math.min(files.length, allowedNewCount); i++) {
      const file = files[i];
      if (file.type.startsWith("image/") && file.size <= 4 * 1024 * 1024) {
        newPreviews.push({ file: file, url: URL.createObjectURL(file) });
      } else {
        console.warn(`File ${file.name} is invalid (type or size)`);
      }
    }

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImagePreview = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove].url);
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const addMedicineLinkInput = () => {
    if (medicineLinks.length < 5) {
      setMedicineLinks([...medicineLinks, ""]);
    }
  };

  const removeMedicineLinkInput = (indexToRemove: number) => {
    setMedicineLinks(
      medicineLinks.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleMedicineLinkChange = (index: number, value: string) => {
    const updatedLinks = [...medicineLinks];
    updatedLinks[index] = value;
    setMedicineLinks(updatedLinks);
  };

  useEffect(() => {
    let didUnmount = false;
    if (state?.message && !state?.success) {
      console.error("Form submission error:", state.errors);
    }
    return () => {
      didUnmount = true;
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [state]);

  return (
    <>
      {/* Display General Form Error */}
      {state?.message && !state.success && state.errors?._form && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.errors._form.join(", ")}</AlertDescription>
        </Alert>
      )}
      {/* Display Success Message */}
      {state?.success && (
        <Alert
          variant="default"
          className="mb-4 bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-700"
        >
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">
            Success!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Your post has been created. Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <form
        ref={formRef}
        key={formKey}
        action={formAction}
        className="space-y-6"
        onSubmit={(e) => {
          const formData = new FormData(e.currentTarget);
          const images = formData.getAll("images");
          console.log("Images before submission:", images);
        }}
      >
        <div className="flex flex-col justify-center gap-2">
          <Label htmlFor="communityId">
            Choose Community <span className="text-red-500">*</span>
          </Label>
          <Select
            name="communityId"
            required
            defaultValue={
              communityName
                ? communities.find((c) => c.name === communityName)?.id || ""
                : ""
            }
          >
            <SelectTrigger
              id="communityId"
              className={state?.errors?.communityId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select community..." />
            </SelectTrigger>
            <SelectContent>
              {communities.length === 0 && (
                <SelectItem value="" disabled>
                  No communities available...
                </SelectItem>
              )}
              {communities.map((community) => (
                <SelectItem key={community.id} value={community.id}>
                  h/{community.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state?.errors?.communityId && (
            <p className="text-sm text-red-600 mt-1">
              {state.errors.communityId[0]}
            </p>
          )}
          {communities.length === 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              No communities found. Maybe{" "}
              <Link href="/app/create-community" className="underline">
                create one
              </Link>
              ?
            </p>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col justify-center gap-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            required
            minLength={3}
            maxLength={120}
            placeholder="e.g., Effective home remedy for tension headaches"
            className={state?.errors?.title ? "border-red-500" : ""}
            aria-invalid={!!state?.errors?.title}
            aria-describedby={state?.errors?.title ? "title-error" : undefined}
          />
          {state?.errors?.title && (
            <p id="title-error" className="text-sm text-red-600 mt-1">
              {state.errors.title[0]}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-2">
          <Label htmlFor="content">
            Content (Solution/Remedy) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="content"
            name="content"
            required
            minLength={10}
            rows={10}
            placeholder="Describe the condition briefly and share your detailed solution, remedy, or experience..."
            className={state?.errors?.content ? "border-red-500" : ""}
            aria-invalid={!!state?.errors?.content}
            aria-describedby={
              state?.errors?.content ? "content-error" : undefined
            }
          />
          {state?.errors?.content && (
            <p id="content-error" className="text-sm text-red-600 mt-1">
              {state.errors.content[0]}
            </p>
          )}
        </div>

        {/* Image Upload & Preview */}
        <div className="space-y-1">
          <Label htmlFor="images">Add Images (Optional, Max 3, 4MB each)</Label>
          <input
            id="images"
            ref={fileInputRef}
            name="images"
            type="file"
            accept="images/*"
            multiple
            onChange={handleFileChange}
            className={`w-md file:mr-4 file:py-1 file:px-4 file:rounded-md file:cursor-pointer file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 ${
              state?.errors?.images ? "border-red-500" : ""
            }`}
            aria-invalid={!!state?.errors?.images}
            aria-describedby={
              state?.errors?.images ? "images-error" : undefined
            }
          />
          <p className="text-xs text-muted-foreground">
            You can upload up to {3 - imagePreviews.length} more image(s).
          </p>
          {state?.errors?.images && (
            <p id="images-error" className="text-sm text-red-600 mt-1">
              {state.errors.images[0]}
            </p>
          )}

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 30vw, 200px"
                    className="object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-75 group-hover:opacity-100"
                    onClick={() => removeImagePreview(index)}
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicine Links */}
        <div className="space-y-3">
          <Label>Medicine Links (Optional, Max 5)</Label>
          {medicineLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="url"
                name="medicineLinks"
                placeholder={`https://example-pharmacy.com/medicine${
                  index + 1
                }`}
                value={link}
                onChange={(e) =>
                  handleMedicineLinkChange(index, e.target.value)
                }
                className={
                  state?.errors?.medicineLinks?.[index] ? "border-red-500" : ""
                }
                aria-invalid={!!state?.errors?.medicineLinks?.[index]}
                aria-describedby={
                  state?.errors?.medicineLinks?.[index]
                    ? `link-error-${index}`
                    : undefined
                }
              />
              {medicineLinks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMedicineLinkInput(index)}
                  aria-label="Remove link"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
          {/* Display validation errors for links array */}
          {state?.errors?.medicineLinks &&
            Array.isArray(state.errors.medicineLinks) &&
            medicineLinks.map(
              (_, index) =>
                state?.errors?.medicineLinks?.[index] && (
                  <p
                    key={index}
                    id={`link-error-${index}`}
                    className="text-sm text-red-600 mt-1"
                  >
                    Link {index + 1}: {state.errors.medicineLinks[index]}
                  </p>
                )
            )}
          {state?.errors?.medicineLinks &&
            typeof state.errors.medicineLinks === "string" && (
              <p className="text-sm text-red-600 mt-1">
                {state.errors.medicineLinks}
              </p>
            )}

          {medicineLinks.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMedicineLinkInput}
              className="flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Another Link</span>
            </Button>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
