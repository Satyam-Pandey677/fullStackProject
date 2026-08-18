import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ImagePlus, PackagePlus, X } from "lucide-react";
import Cookies from "js-cookie";
import { PRODUCT_SERVICE } from "../../Constent";

interface Category {
  _id: string;
  name: string;
}

interface ProductForm {
  name: string;
  description: string;
  startingPrice: string;
  duration: string;
  durationType: "hr" | "min";
  category: string;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  startingPrice: "",
  duration: "",
  durationType: "hr",
  category: "",
};

const CreateProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${PRODUCT_SERVICE}/api/categories`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        if (!response.ok) throw new Error("Unable to load categories.");
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Unable to load categories.",
        });
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const closeModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setForm(emptyForm);
    setImages([]);
  };

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    const selectedImages = Array.from(files).slice(0, 4);
    setImages(selectedImages);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (images.length === 0) {
      setMessage({ type: "error", text: "Add at least one product image." });
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("description", form.description.trim());
      body.append("starting_price", form.startingPrice);
      body.append("duration", form.duration);
      body.append("durationType", form.durationType);
      body.append("category", form.category);
      images.forEach((image) => body.append("images", image));

      const response = await fetch(
        `${PRODUCT_SERVICE}/api/product/create-product`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          body,
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.message || "Unable to create product.");

      setMessage({ type: "success", text: "Product created successfully." });
      setSubmitting(false);
      closeModal();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to create product.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
              Admin workspace
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              Product studio
            </h1>
            <p className="mt-3 max-w-xl text-slate-300">
              Bring a new item to the marketplace and set up its auction in a
              few steps.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <PackagePlus size={19} />
            Add product
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            "Up to 4 images",
            "Flexible auction duration",
            "Secure admin publishing",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>

        {message && !isModalOpen && (
          <p
            className={`mt-6 rounded-xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}
          >
            {message.text}
          </p>
        )}
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-product-title"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 shadow-[0_25px_100px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-sm font-semibold text-orange-300">
                  New listing
                </p>
                <h2
                  id="create-product-title"
                  className="mt-1 text-2xl font-bold"
                >
                  Create product
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close product form"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6 sm:px-8"
            >
              {message?.type === "error" && (
                <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {message.text}
                </p>
              )}
              <label className="block text-sm font-medium text-slate-200">
                Product name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400"
                  placeholder="e.g. Vintage camera"
                />
              </label>
              <label className="block text-sm font-medium text-slate-200">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400"
                  placeholder="Tell bidders what makes this item special"
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-200">
                  Starting price
                  <input
                    required
                    min="1"
                    step="0.01"
                    type="number"
                    value={form.startingPrice}
                    onChange={(event) =>
                      setForm({ ...form, startingPrice: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-400"
                    placeholder="0.00"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                  Auction duration
                  <div className="mt-2 flex">
                    <input
                      required
                      min="1"
                      type="number"
                      value={form.duration}
                      onChange={(event) =>
                        setForm({ ...form, duration: event.target.value })
                      }
                      className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-400"
                      placeholder="24"
                    />
                    <select
                      value={form.durationType}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          durationType: event.target.value as "hr" | "min",
                        })
                      }
                      className="rounded-r-xl border border-white/10 bg-slate-700 px-3 text-white outline-none"
                    >
                      <option value="hr">Hours</option>
                      <option value="min">Minutes</option>
                    </select>
                  </div>
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-200">
                Category
                <select
                  required
                  disabled={categoriesLoading}
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-orange-400"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-200">
                  Product images{" "}
                  <span className="font-normal text-slate-400">(up to 4)</span>
                </p>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-orange-400/40 bg-orange-500/5 px-4 py-6 text-center transition hover:bg-orange-500/10">
                  <ImagePlus className="mb-2 text-orange-300" size={26} />
                  <span className="text-sm text-slate-200">
                    Choose images from your device
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    PNG, JPG, or WEBP
                  </span>
                  <input
                    required={images.length === 0}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => handleImages(event.target.files)}
                    className="sr-only"
                  />
                </label>
                {images.length > 0 && (
                  <p className="mt-2 text-xs text-slate-400">
                    {images.map((image) => image.name).join(", ")}
                  </p>
                )}
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-5 py-3 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  type="submit"
                  className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Publishing..." : "Publish product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default CreateProduct;
