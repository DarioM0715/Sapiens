import { useState } from "react";
import { useNavigate } from "react-router-dom";

//COMPONENTS
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { useCreatePost } from "@/hooks/useContent";

const CreateArticle = ({ document }: { document: boolean }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [categories, setCategories] = useState("");
  const [institution, setInstitution] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [body, setBody] = useState("");

  const createPost = useCreatePost();

  const cancel = () => {
    navigate(-1);
  };

  const publish = () => {
    if (!title.trim() || !body.trim() || createPost.isPending) return;

    createPost.mutate(
      {
        title: title.trim(),
        description: body.trim(),
        content: body.trim(),
        type: type.trim() || (document ? "Documento" : "Mensaje"),
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
        institution: institution.trim() || undefined,
        documentUrl: document ? documentUrl.trim() || undefined : undefined,
      },
      {
        onSuccess: (post) => navigate(`/post/${post.id}`),
      }
    );
  };

  return (
    <div className="flex items-center justify-center px-5 lg:px-10 xl:px-20 w-full h-screen bg-surface">
      <div className="w-full my-5 mx-5 lg:mx-10 xl:mx-20 p-8 bg-surface rounded-2xl border-default shadow-md">
        <div className="flex flex-col gap-4">
          <div className="border-b border-[var(--color-border)] pb-4 font-semibold text-primary">{document ? "Publicar documento" : "Publicar mensaje"}</div>

          {/* Title */}
          <div className="relative">
            <input
              type="text"
              placeholder="Título (obligatorio)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
            />
            <div className="absolute bottom-4 right-4 flex items-center justify-end">
              <span id="title-counter" className="text-xs text-muted">
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Type + Category row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tipo de publicación"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
            />

            <input
              type="text"
              placeholder="Categorías (separadas por coma)"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
            />
          </div>

          {/* Document specific fields */}
          {document && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Institución"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
              />

              <input
                type="text"
                placeholder="URL del documento o DOI"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
              />
            </div>
          )}

          {/* Body */}
          <div className="mb-6">
            <label htmlFor="bodyInput" className="sr-only">
              Contenido
            </label>
            <div className="border-default rounded-md p-4 bg-surface-2">
              <textarea
                id="bodyInput"
                placeholder="Introduce el contenido de la publicación"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full min-h-[300px] text-md text-primary outline-none resize-vertical font-semibold"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="w-10" />

            <div className="flex items-center gap-3">
              <ButtonAction
                onClick={cancel}
                type="button"
                className="px-4 py-2 rounded-md border border-[var(--color-border)] bg-surface text-primary hover-surface-2 transition"
              >
                Cancelar
              </ButtonAction>

              <ButtonAction
                type="button"
                onClick={publish}
                disabled={!title.trim() || !body.trim() || createPost.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{createPost.isPending ? "Publicando..." : "Publicar"}</span>
              </ButtonAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;