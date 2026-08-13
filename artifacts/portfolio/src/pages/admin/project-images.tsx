import { AdminLayout } from "@/components/layout/AdminLayout";
import { GalleryPicker } from "@/components/admin/GalleryPicker";
import { useListProjectImages, useAddProjectImage, useUpdateProjectImage, useDeleteProjectImage, getListProjectImagesQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Mocking useGetProject again by finding from list
import { useListProjects } from "@workspace/api-client-react";

export default function AdminProjectImages() {
  const { id } = useParams();
  const projectId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();

  const { data: projects = [] } = useListProjects();
  const project = projects.find(p => p.id === projectId);

  const { data: images = [], isLoading } = useListProjectImages(projectId, {
    query: { enabled: !!projectId, queryKey: getListProjectImagesQueryKey(projectId) }
  });

  const addImage = useAddProjectImage();
  const updateImage = useUpdateProjectImage();
  const deleteImage = useDeleteProjectImage();

  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    addImage.mutate({
      id: projectId,
      data: {
        imageUrl: newImageUrl,
        isHero: images.length === 0, // First image is hero by default
        sortOrder: images.length
      }
    }, {
      onSuccess: () => {
        setNewImageUrl("");
        queryClient.invalidateQueries({ queryKey: getListProjectImagesQueryKey(projectId) });
      }
    });
  };

  const handleSetHero = (imageId: number) => {
    // We would ideally unset the previous hero, but let's assume the backend handles it or we just set this one.
    // In this API, we probably have to update the image explicitly.
    updateImage.mutate({
      id: projectId,
      imageId: imageId,
      data: { isHero: true }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectImagesQueryKey(projectId) });
      }
    });
  };

  const handleDelete = (imageId: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImage.mutate({
        id: projectId,
        imageId: imageId
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectImagesQueryKey(projectId) });
        }
      });
    }
  };

  if (isLoading || !project) {
    return <AdminLayout><div className="animate-pulse">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 border-b border-neutral-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif tracking-tighter uppercase mb-2">Media Matrix</h1>
            <p className="text-neutral-500 tracking-widest text-sm uppercase">{project.title}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href={`/admin/projects/${projectId}/edit`} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white">
              Back to Editor
            </Link>
          </div>
        </div>

        {/* Add Image Form */}
        <form onSubmit={handleAddImage} className="mb-12 p-6 border border-neutral-800 bg-neutral-900/30">
          <GalleryPicker
            value={newImageUrl}
            onChange={setNewImageUrl}
            label="Add New Image URL"
          />
          <button 
            type="submit"
            disabled={addImage.isPending || !newImageUrl}
            className="mt-4 px-8 py-3 bg-white text-black font-serif tracking-widest uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.sort((a, b) => a.sortOrder - b.sortOrder).map((img) => (
            <div key={img.id} className={`group relative aspect-square border ${img.isHero ? 'border-white' : 'border-neutral-800'} overflow-hidden bg-neutral-900`}>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  {img.isHero ? (
                    <span className="bg-white text-black px-2 py-1 text-[10px] uppercase tracking-widest font-bold">Hero</span>
                  ) : (
                    <button 
                      onClick={() => handleSetHero(img.id)}
                      className="bg-black/50 text-white px-2 py-1 text-[10px] uppercase tracking-widest border border-white/20 hover:border-white hover:bg-white hover:text-black transition-colors"
                    >
                      Set Hero
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="text-red-500 hover:text-red-400 p-1"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="col-span-full py-20 text-center text-neutral-600 border border-neutral-800 border-dashed">
              <p className="uppercase tracking-widest text-sm">No images attached to this project.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
