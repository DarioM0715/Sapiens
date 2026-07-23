//REACT
import { useNavigate } from "react-router-dom";

//COMPONENTS
import { ButtonAction } from "@/shared/ui/ButtonAction";

// ICONS
import { Paperclip } from "lucide-react";

const CreateArticle = ({ document }: { document: boolean }) => {
  const navigate = useNavigate();

  const cancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center px-5 lg:px-10 xl:px-20 w-full h-screen bg-surface">
      <div className="w-full my-5 mx-5 lg:mx-10 xl:mx-20 p-8 bg-surface rounded-2xl border-default shadow-md">
        <div className="flex flex-col gap-4">
          <div className="border-b border-[var(--color-border)] pb-4 font-semibold text-primary">{document ? "Publicar documento" : "Publicar mensaje"}</div>

          {/* Archive */}
          {document && (
            <>
              <div className="font-semibold text-primary">Archivo</div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <label
                    htmlFor="attachment-upload"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-primary cursor-pointer hover:bg-surface transition"
                    title="Añadir archivo adjunto"
                  >
                    <Paperclip size={18} className="text-primary" />
                    <span className="text-sm font-semibold">Añadir archivo</span>
                    <input id="attachment-upload" type="file" className="sr-only" />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Title */}
          {document && (
            <div className="relative">
              <input
                type="text"
                placeholder="Introduce un título (obligatorio)"
                className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
              />
              <div className="absolute bottom-4 right-4 flex items-center justify-end">
                <span id="title-counter" className="text-xs text-muted">
                  0/200
                </span>
              </div>
            </div>
          )}

          {/* Type + Category row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Tipo de publicación" className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary" />

            <input type="text" placeholder="Categoría" className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary" />
          </div>

          {/* Body */}
          <div className="mb-6">
            <label htmlFor="bodyInput" className="sr-only">
              Contenido
            </label>
            <div className="border-default rounded-md p-4 bg-surface-2">
              <textarea
                id="bodyInput"
                placeholder="Introduce el contenido de la publicación"
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

              <ButtonAction type="button" className="inline-flex items-center gap-2 px-4 py-2 btn-primary">
                <span>Publicar</span>
              </ButtonAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
