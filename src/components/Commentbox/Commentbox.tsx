import React from "react";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Download } from "lucide-react";
import { Paperclip, Smile, Send } from "lucide-react";
import { PostCard } from "../Cards/PostCard";
import { Avatar } from "../Avatar";
import { useAuthContext } from "@/context/AuthContext";
import image from "@/assets/images/20260328_032700.jpg"

const post = {
  id: 100,
  title: "Revisión exhaustiva de sistemas de administración de fármacos mediada por nanopartículas",
  description:
    "Revisión exhaustiva de estrategias basadas en nanopartículas para la administración dirigida de fármacos, con énfasis en la traducción clínica.",
  image: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=1400&q=80&auto=format&fit=crop",
  time: "2025-10-20T10:00:00Z",
  categories: ["Revisión con peer-review", "Nanomedicina", "Artículo de revisión"],
  views: 1240,
  messages: 18,
  likes: 230,
  dislikes: 3,
  documentUrl: "https://doi.org/10.1234/example.doi.2025.001",
  content:
    "Los sistemas de liberación de fármacos mediada por nanopartículas han progresado rápidamente en la última década. Esta revisión sintetiza los avances recientes en entrega dirigida, liberación controlada, biocompatibilidad y desafíos para la traducción clínica. Se discuten métodos de fabricación, estrategias de funcionalización superficial y estudios de caso de ensayos clínicos exitosos.",
  metadata: {
    authors: [
      { name: "Dra. Ana López", affiliation: "Departamento de Ingeniería Química, Universidad X" },
      { name: "Dr. Marco Rivera", affiliation: "Instituto de Bioingeniería, Laboratorio de Investigación Y" },
    ],
    journal: "Revista Internacional de Nanomedicina",
    doi: "10.1234/example.doi.2025.001",
    volume: "42",
    issue: "7",
    pages: "101-128",
    publishedAt: "2025-10-18",
  },
  user: {
    id: 0,
    name: "Equipo Editorial",
    email: "editorial@journal.example",
    password: "••••••",
    avatar: image,
  },
};

const Commentbox: React.FC = () => {
  const { content, documentUrl, metadata } = post;
  const { user } = useAuthContext();
  const isDesktop = useIsDesktop(1024);

  return (
    <div className={`bg-surface text-primary min-h-[60vh] py-8 ${isDesktop ? "px-10" : "px-4"}`} aria-label="Documento y comentarios">
      <div className={isDesktop ? "max-w-[1200px] mx-0 grid grid-cols-[1fr_320px] gap-8 items-start" : "max-w-3xl mx-auto"}>
        <div>
          <PostCard post={post} />

          <div className="mt-4 p-4 bg-surface-2 rounded-md border-default">
            <h2 className="text-2xl font-bold mb-3 text-primary">Contenido:</h2>
            <p className="text-primary leading-relaxed">{content}</p>

            <div className="mt-4">
              {documentUrl && (
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-default transition text-primary bg-surface hover:bg-surface-2"
                >
                  <Download size={18} />
                  Ver / Descargar documento (DOI)
                </a>
              )}
            </div>
          </div>

          {/* Comentarios */}
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4 text-primary">Comentarios:</h3>

            {/* Composer visual (INPUT — sin lógica) */}
            <div className="mb-4 p-4 bg-surface-2 border-default rounded-lg">
              <label htmlFor="comment-input" className="sr-only">
                Escribe un comentario
              </label>

              <div className="flex items-start gap-3">
                <Avatar user={user} size={10} />

                <div className="flex-1">
                  <textarea
                    id="comment-input"
                    placeholder="Escribe tu comentario..."
                    rows={3}
                    className="w-full input-underline resize-none bg-transparent text-primary placeholder:text-muted focus-ring-primary"
                    aria-label="Escribe tu comentario"
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button type="button" aria-label="Adjuntar archivo" className="p-2 rounded-md hover:bg-surface transition">
                        <Paperclip size={18} className="text-primary" />
                      </button>

                      <button type="button" aria-label="Agregar emoji" className="p-2 rounded-md hover:bg-surface transition">
                        <Smile size={18} className="text-primary" />
                      </button>
                    </div>

                    <div>
                      <button type="button" aria-label="Enviar comentario" className="inline-flex items-center gap-2 px-4 py-2 btn-primary">
                        <Send size={16} />
                        <span>Comentar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <PostCard post={post} />
            </div>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="p-4 bg-surface-2 rounded-md border-default sticky top-6" style={{ maxHeight: "calc(100vh - 6rem)" }}>
            <h4 className="text-lg font-semibold mb-3 text-primary">Ficha del artículo</h4>

            <div className="mb-3">
              <p className="text-sm text-muted">Autores</p>
              <ul className="mt-2 space-y-2">
                {metadata.authors.map((a: any) => (
                  <li key={a.name} className="text-sm">
                    <span className="font-medium text-primary">{a.name}</span>
                    <div className="text-xs text-muted">{a.affiliation}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-2">
              <p className="text-sm text-muted">Revista</p>
              <p className="text-sm font-medium text-primary">{metadata.journal}</p>
            </div>

            <div className="mb-2">
              <p className="text-sm text-muted">DOI</p>
              <a href={`https://doi.org/${metadata.doi}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent break-all">
                {metadata.doi}
              </a>
            </div>

            <div className="mb-2">
              <p className="text-sm text-muted">Vol. / Issue</p>
              <p className="text-sm text-primary">
                {metadata.volume} • {metadata.issue}
              </p>
            </div>

            <div className="mb-2">
              <p className="text-sm text-muted">Páginas</p>
              <p className="text-sm text-primary">{metadata.pages}</p>
            </div>

            <div className="mb-3">
              <p className="text-sm text-muted">Publicado</p>
              <p className="text-sm text-primary">{metadata.publishedAt}</p>
            </div>

            <div className="mt-3">
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2 rounded-md transition border-default text-primary bg-surface hover:bg-surface-2"
              >
                Descargar PDF
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Commentbox;
