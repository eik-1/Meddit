"use client";

import { JSX, useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { amiri } from "@/fonts/fonts";
import { createCommunity, type CreateCommunityState } from "@/lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-md" disabled={pending}>
      {pending ? "Creating..." : "Create Community"}
    </Button>
  );
}

export default function CreateCommunityPage(): JSX.Element {
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const initialState: CreateCommunityState | undefined = undefined;
  const [state, formAction] = useActionState(createCommunity, initialState);

  useEffect(() => {
    if (state?.success && state.communityName) {
      router.push(`/app/h/${state.communityName}`);
    }
  }, [state, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="container mx-auto mt-10 ml-10 mb-10">
      <h1 className={`${amiri.className} text-5xl`}>Create A Community</h1>

      <form action={formAction}>
        <div className="flex flex-col gap-5 mt-10 bg-zinc-100 rounded-2xl max-w-5xl px-10 py-10 dark:bg-zinc-900">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">
              Tell us more about your community
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-300">
              A name and description helps people find your community. Make sure
              that the medical condition for which you are creating the
              community does not already exist.
            </p>
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              Error: {state.error}
            </p>
          )}

          <div className="flex flex-row gap-20">
            <div className="max-w-fit flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <Label className="text-lg" htmlFor="name">
                  Community Name
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Asthma, Acne, etc."
                  className="w-md"
                  required
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  aria-describedby="name-error"
                  disabled={useFormStatus().pending}
                />
                {state?.error && state.error.toLowerCase().includes("name") && (
                  <p id="name-error" className="text-xs text-destructive">
                    {state.error}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-lg" htmlFor="description">
                  Description
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="w-md"
                  placeholder="Describe your community"
                  required
                  value={communityDescription}
                  onChange={(e) => setCommunityDescription(e.target.value)}
                  aria-describedby="description-error"
                  disabled={useFormStatus().pending}
                />
                {state?.error &&
                  state.error.toLowerCase().includes("description") && (
                    <p
                      id="description-error"
                      className="text-xs text-destructive"
                    >
                      {state.error}
                    </p>
                  )}
              </div>
              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <Label className="text-lg" htmlFor="image">
                  Community Logo
                </Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="w-md file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  onChange={handleFileChange}
                  aria-describedby="image-error"
                  disabled={useFormStatus().pending}
                />
                {state?.error &&
                  state.error.toLowerCase().includes("image") && (
                    <p id="image-error" className="text-xs text-destructive">
                      {state.error}
                    </p>
                  )}
              </div>
              <SubmitButton />
            </div>

            {/* Preview */}
            <div className="max-w-fit">
              <div className="bg-card text-card-foreground rounded-lg p-4 w-80 h-fit shadow-md">
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                    <Image
                      src={imagePreview}
                      alt="Community logo preview"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted mb-3 flex items-center justify-center text-muted-foreground">
                    Logo
                  </div>
                )}
                <h3 className="text-lg font-semibold break-words">
                  h/{communityName.toLowerCase() || "communityname"}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  1 member • 1 online
                </p>
                <p className="text-sm break-words">
                  {communityDescription || "Your community description"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
