import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Download, Paperclip, Smile, Send, ThumbsUp } from "lucide-react";
import { PostCard } from "../Cards/PostCard";
import { Avatar } from "../Avatar";
import { useAuthContext } from "@/context/AuthContext";
import { usePost, useComments, useAddComment, useLikeComment } from "@/hooks/useContent";
import { timeAgo } from "@/shared/utils/utilsfunctions";
import type { Comment } from "@/types/post";

const CommentRow = ({ comment }: { comment: Comment }) => {
  const likeComment = useLikeComment();

  return (
    <div className="p-4 bg-surface-2 border-default rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar user={comment.user} size={9} />
        <div className="flex flex-col leading-tight">
          <p className="font-semibold text-primary text-sm">{comment.user.name || comment.user.username}</p>
          <p className="text-xs text-muted">{timeAgo(comment.time)}</p>
        </div>
      </div>

      <p className="mt-3 text-primary text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>

      <button
        type="button"
        onClick={() => likeComment.mutate(comment.id)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition cursor-pointer"
      >
        <ThumbsUp size={14} />
        <span>{comment.likes}</span>
      </button>
    </div>
  );
};

const Commentbox: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuthContext();
  const isDesktop = useIsDesktop(1024);

  const [text, setText] = useState("");

  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: comments = [], isLoading: commentsLoading } = useComments(id);
  const addComment = useAddComment(id);

  const handleSubmit = () => {
    if (!text.trim() || addComment.isPending) return;
    addComment.mutate(text.trim(), {
      onSuccess: () => setText(""),
      onError: () => navigate("/login"),
    });
  };

  if (postLoading) {
    return <p className="py-10 text-center text-muted">Cargando publicación...</p>;
  }

  if (!post) {
    return <p className="py-10 text-center text-muted">La publicación no existe.</p>;
  }

  const { content, description, documentUrl, type, institution, bibliography } = post;

  return (
    <div className={`bg-surface text-primary min-h-[60vh] py-8 ${isDesktop ? "px-10" : "px-4"}`} aria-label="Documento y comentarios">
      <div className={isDesktop ? "max-w-[1200px] mx-0 grid grid-cols-[1fr_320px] gap-8 items-start" : "max-w-3xl mx-auto"}>
        <div>
          <PostCard post={post} className="border rounded-md border-[var(--color-border)]" />

          <div className="mt-4 p-4 bg-surface-2 rounded-md border-default">
            <h2 className="text-2xl font-bold mb-3 text-primary">Contenido:</h2>
            <p className="text-primary leading-relaxed whitespace-pre-wrap">{content || description}</p>

            <div className="mt-4">
              <div className="flex flex-wrap gap-3">
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

                {type && (
                  <span className="inline-flex items-center px-4 py-2 rounded-md border-default bg-surface-2 text-primary text-sm">
                    Tipo: <strong className="ml-1">{type}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4 text-primary">Comentarios:</h3>

            {isLoadingAuth ? null : user ? (
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
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full input-underline bg-transparent text-primary placeholder:text-muted"
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
                        <button
                          type="button"
                          aria-label="Enviar comentario"
                          onClick={handleSubmit}
                          disabled={!text.trim() || addComment.isPending}
                          className="inline-flex items-center gap-2 px-4 py-2 btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                          <span>{addComment.isPending ? "Enviando..." : "Comentar"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-surface-2 border-default rounded-lg text-center">
                <p className="text-sm text-muted mb-3">Inicia sesión para comentar.</p>
                <Link to="/login" className="inline-flex items-center px-4 py-2 btn-primary rounded-md">
                  Iniciar sesión
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {commentsLoading && <p className="py-4 text-center text-muted">Cargando comentarios...</p>}
              {!commentsLoading && comments.length === 0 && <p className="py-4 text-center text-muted">Aún no hay comentarios, ¡sé el primero!</p>}
              {comments.map((comment) => (
                <CommentRow key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="p-4 bg-surface-2 rounded-md border-default sticky top-6" style={{ maxHeight: "calc(100vh - 6rem)" }}>
            <h4 className="text-lg font-semibold mb-3 text-primary">Ficha del artículo</h4>

            {type && (
              <div className="mb-2">
                <p className="text-sm text-muted">Tipo</p>
                <p className="text-sm font-medium text-primary">{type}</p>
              </div>
            )}

            {institution && (
              <div className="mb-2">
                <p className="text-sm text-muted">Institución</p>
                <p className="text-sm font-medium text-primary">{institution}</p>
              </div>
            )}

            {documentUrl && (
              <div className="mb-2">
                <p className="text-sm text-muted">DOI</p>
                <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent break-all">
                  {documentUrl}
                </a>
              </div>
            )}

            {bibliography && bibliography.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-muted">Bibliografía</p>
                <ul className="mt-2 space-y-2">
                  {bibliography.map((b, i) => (
                    <li key={`${b.title}-${i}`} className="text-sm">
                      <span className="font-medium text-primary">{b.title}</span>
                      {b.description && <div className="text-xs text-muted">{b.description}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {documentUrl && (
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
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Commentbox;