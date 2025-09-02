"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";

interface BicycleFormData {
  title: string;
  description: string;
  price: number;
  condition: string;
  brand: string;
  model: string;
  year: number | "";
  size: string;
  color: string;
  isStolen: boolean;
  stolenDate: string;
  stolenLocation: string;
}

export default function BicycleForm() {
  const [formData, setFormData] = useState<BicycleFormData>({
    title: "",
    description: "",
    price: 0,
    condition: "new",
    brand: "",
    model: "",
    year: "",
    size: "",
    color: "",
    isStolen: false,
    stolenDate: "",
    stolenLocation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t("bicycle.form.basicInfo")}
        </h2>
      </div>
      
      <div>
        <label htmlFor="title" className="form-label">
          {t("bicycle.form.titleLabel")}
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-input w-full"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">
          {t("bicycle.form.descriptionLabel")}
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="form-input w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="form-label">
            {t("bicycle.form.priceLabel")}
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="form-input w-full"
          />
        </div>
        
        <div>
          <label htmlFor="condition" className="form-label">
            {t("bicycle.form.conditionLabel")}
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="form-input w-full"
          >
            <option value="new">Uusi</option>
            <option value="excellent">Erinomainen</option>
            <option value="good">Hyvä</option>
            <option value="fair">Kohtalainen</option>
            <option value="poor">Huono</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className="form-label">
            {t("bicycle.form.brandLabel")}
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
        
        <div>
          <label htmlFor="model" className="form-label">
            {t("bicycle.form.modelLabel")}
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="year" className="form-label">
            {t("bicycle.form.yearLabel")}
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            className="form-input w-full"
          />
        </div>
        
        <div>
          <label htmlFor="size" className="form-label">
            {t("bicycle.form.sizeLabel")}
          </label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="color" className="form-label">
          {t("bicycle.form.colorLabel")}
        </label>
        <input
          type="text"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="form-input w-full"
        />
      </div>
      
      <div>
        <label className="form-label flex items-center">
          <input
            type="checkbox"
            name="isStolen"
            checked={formData.isStolen}
            onChange={handleChange}
            className="mr-2"
          />
          <span>{t("bicycle.form.isStolenLabel")}</span>
        </label>
      </div>
      
      {formData.isStolen && (
        <>
          <div>
            <label htmlFor="stolenDate" className="form-label">
              {t("bicycle.form.stolenDateLabel")}
            </label>
            <input
              type="date"
              id="stolenDate"
              name="stolenDate"
              value={formData.stolenDate}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="stolenLocation" className="form-label">
              {t("bicycle.form.stolenLocationLabel")}
            </label>
            <input
              type="text"
              id="stolenLocation"
              name="stolenLocation"
              value={formData.stolenLocation}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>
        </>
      )}
      
      <div>
        <label className="form-label">
          {t("bicycle.form.imagesLabel")}
        </label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>Lataa tiedosto</span>
                <input 
                  type="file" 
                  className="sr-only" 
                  multiple 
                  accept="image/*"
                />
              </label>
              <p className="pl-1">tai raahaa ja pudota</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF enintään 10MB
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button type="button" className="btn-secondary">
          {t("common.cancel")}
        </button>
        <button type="submit" className="btn-primary">
          {t("bicycle.form.submit")}
        </button>
      </div>
    </form>
  );
}