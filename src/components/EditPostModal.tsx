import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { DeleteConfirmView } from "./DeleteConfirmView";
import { posts } from "../lib/mock";
import type { Post } from "../types/Post";

type EditPostModalProps = {
    post: Post;
    open: boolean;
    onClose: () => void;
}

export function EditPostModal({post, open, onClose}: EditPostModalProps){
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [title, setTitle] = useState(post.title ?? "");
    const [text, setText] = useState(post.text ?? "");

    function handleClose() {
        onClose();
        setTimeout(() => setShowDeleteConfirm(false), 200);
    }

    function handleSave(e: React.FormEvent){
        e.preventDefault();
        const idx = posts.findIndex((p) => p.id == post.id);
        if (idx !== -1){
            posts[idx] = {...posts[idx], title, text};
        }
        window.dispatchEvent(new CustomEvent("posts-updated"));
        handleClose();
    }

    function handleDelete(){
        const idx = posts.findIndex((p) => p.id == post.id);
        if(idx !== -1){
            posts.splice(idx, 1);
        }
        window.dispatchEvent(new CustomEvent("posts-updated"));
        handleClose();        
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
            <DialogContent className="sm:max-w-lg w-full rounded-3xl border-none bg-white shadow-2xl overflow-hidden max-h-[90vh] p-0">
                {showDeleteConfirm ? (
                <div className="p-6 md:p-8">
                    <DeleteConfirmView
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDelete}
                    />
                </div>
                ) : (
                <div className="flex flex-col h-full">

                    {/* Área scrollável */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 scrollbar-none">
                    <div className="pb-4 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">Editar post</h2>
                    </div>

                    <form id="edit-post-form" onSubmit={handleSave} className="flex flex-col gap-4">
                        <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Título</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-xl border-gray-200 bg-gray-50/30 py-3 text-base focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50"
                            placeholder="Título do post"
                        />
                        </div>

                        <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Texto</label>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="rounded-xl border-gray-200 bg-gray-50/30 text-base focus-visible:border-[#efce7b] focus-visible:ring-[#efce7b]/50 resize-none p-4"
                            rows={4}
                            placeholder="Conteúdo do post..."
                        />
                        </div>
                    </form>

                    <div className="pt-2">
                        <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-sm font-bold text-red-500 hover:underline"
                        >
                        Excluir post
                        </button>
                        <p className="text-xs text-gray-400 mt-0.5">O post será removido permanentemente.</p>
                    </div>
                    </div>

                    {/* Rodapé fixo */}
                    <div className="shrink-0 px-6 md:px-8 py-6 border-t border-gray-100 bg-white rounded-b-3xl">
                    <Button
                        type="submit"
                        form="edit-post-form"
                        className="rounded-full px-6 h-10 text-sm text-white bg-[#e1903e]/85 hover:bg-[#e1903e] transition shadow-sm"
                    >
                        Salvar alterações
                    </Button>
                    </div>
                </div>
                )}
            </DialogContent>
        </Dialog>
    );
}