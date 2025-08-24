import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";

interface AdminPanelProps {
  token: string;
}

export function AdminPanel({ token }: AdminPanelProps) {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    featuredImage: "",
    published: false,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/posts"],
    meta: {
      headers: { Authorization: `Bearer ${token}` }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const response = await apiRequest("POST", "/api/admin/posts", {
        ...postData,
        tags: postData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        slug: postData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setNewPost({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        featuredImage: "",
        published: false,
      });
      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
      const response = await apiRequest("PUT", `/api/admin/posts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setEditingPost(null);
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/posts/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    createMutation.mutate(newPost);
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;
    updateMutation.mutate({
      id: editingPost.id,
      data: {
        ...editingPost,
        tags: typeof editingPost.tags === 'string' 
          ? (editingPost.tags as string).split(",").map((tag: string) => tag.trim()).filter(Boolean)
          : editingPost.tags
      }
    });
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your blog posts and content</p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" data-testid="tab-posts">Posts</TabsTrigger>
          <TabsTrigger value="create" data-testid="tab-create">Create New</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Manage Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`post-item-${post.id}`}>
                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid={`post-title-${post.id}`}>{post.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{post.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPost(post)}
                        data-testid={`button-edit-${post.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        data-testid={`button-delete-${post.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-title">Title</Label>
                  <Input
                    id="new-title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title"
                    data-testid="input-new-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-category">Category</Label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger data-testid="select-new-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health Myths">Health Myths</SelectItem>
                      <SelectItem value="Science Myths">Science Myths</SelectItem>
                      <SelectItem value="History Myths">History Myths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-tags">Tags (comma separated)</Label>
                <Input
                  id="new-tags"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  placeholder="nutrition, health, research"
                  data-testid="input-new-tags"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-excerpt">Excerpt</Label>
                <Textarea
                  id="new-excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                  rows={3}
                  data-testid="textarea-new-excerpt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-content">Content (Markdown)</Label>
                <Textarea
                  id="new-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Write your myth-busting article here using Markdown..."
                  rows={12}
                  className="font-mono text-sm"
                  data-testid="textarea-new-content"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newPost.published}
                  onCheckedChange={(checked) => setNewPost({ ...newPost, published: checked })}
                  data-testid="switch-new-published"
                />
                <Label>Publish immediately</Label>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleCreatePost}
                  disabled={createMutation.isPending}
                  data-testid="button-create-post"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    data-testid="input-edit-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editingPost.category} 
                    onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                  >
                    <SelectTrigger data-testid="select-edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health Myths">Health Myths</SelectItem>
                      <SelectItem value="Science Myths">Science Myths</SelectItem>
                      <SelectItem value="History Myths">History Myths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={Array.isArray(editingPost.tags) ? editingPost.tags.join(", ") : editingPost.tags}
                  onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value as any })}
                  data-testid="input-edit-tags"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  rows={3}
                  data-testid="textarea-edit-excerpt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Content (Markdown)</Label>
                <Textarea
                  id="edit-content"
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                  data-testid="textarea-edit-content"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingPost.published}
                  onCheckedChange={(checked) => setEditingPost({ ...editingPost, published: checked })}
                  data-testid="switch-edit-published"
                />
                <Label>Published</Label>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleUpdatePost}
                  disabled={updateMutation.isPending}
                  data-testid="button-update-post"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Updating..." : "Update Post"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingPost(null)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
