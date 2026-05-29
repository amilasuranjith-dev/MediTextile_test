"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveProduct(
  id: string | null, // null represents create, string represents update
  productData: {
    name: string;
    slug: string;
    category: string;
    description: string;
    specifications: Array<{ label: string; value: string }>;
    image_url: string;
    is_sterile: boolean;
    certifications: string[];
  }
) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    console.warn("Supabase credentials not configured. Simulating product save.");
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();

    const payload = {
      name: productData.name,
      slug: productData.slug,
      category: productData.category,
      description: productData.description,
      specifications: JSON.stringify(productData.specifications),
      image_url: productData.image_url || null,
      is_sterile: productData.is_sterile,
      certifications: productData.certifications
    };

    let result;
    if (id) {
      // Update
      result = await supabase
        .from('products')
        .update(payload)
        .eq('id', id);
    } else {
      // Insert
      result = await supabase
        .from('products')
        .insert(payload);
    }

    if (result.error) {
      console.error("Supabase product save error", result.error);
      return { success: false, error: result.error.message };
    }

    // Revalidate public catalog pages to clear caches
    revalidatePath('/products');
    revalidatePath(`/products/${productData.slug}`);
    revalidatePath('/');
    
    return { success: true };
  } catch (err: any) {
    console.error("Save product try-catch block error", err);
    return { success: false, error: err.message || "An unexpected error occurred while saving the product" };
  }
}

export async function deleteProduct(id: string) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase product delete error", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error("Delete product catch block error", err);
    return { success: false, error: err.message || "An unexpected error occurred while deleting the product" };
  }
}
