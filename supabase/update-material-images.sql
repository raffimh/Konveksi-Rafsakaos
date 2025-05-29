-- Update materials with high-quality Unsplash images
update public.materials
set image_url = case name
  when 'Cotton Combed 24s' then 'https://plus.unsplash.com/premium_photo-1723402289679-a6df975abbe2?q=80&w=800&auto=format'
  when 'Cotton Combed 30s' then 'https://plus.unsplash.com/premium_photo-1723834343669-f6f470ad4071?q=80&w=800&auto=format'
  when 'Denim' then 'https://images.unsplash.com/photo-1645859724073-d9bff094b1c7?q=80&w=800&auto=format'
  when 'Rayon' then 'https://images.unsplash.com/photo-1591176134674-87e8f7c73ce9?q=80&w=800&auto=format'
  when 'Linen' then 'https://images.unsplash.com/photo-1591625591034-75d303d2e1a4?q=80&w=800&auto=format'
end;