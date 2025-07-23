import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTaskSchema } from '@shared/schema';
import { z } from 'zod';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/lib/auth';
import { useProjects } from '@/hooks/use-projects';
import { Upload, User, Users, Calendar, Tag, X, Plus } from 'lucide-react';

const extendedTaskSchema = insertTaskSchema.extend({
  images: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
});

type ExtendedTaskFormData = z.infer<typeof extendedTaskSchema>;

interface TaskFormAdvancedProps {
  projectId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskFormAdvanced({ projectId, onSuccess, onCancel }: TaskFormAdvancedProps) {
  const { user } = useAuth();
  const { createTask } = useTasks();
  const { projects } = useProjects();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const form = useForm<ExtendedTaskFormData>({
    resolver: zodResolver(extendedTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      projectId: projectId || '',
      assigneeId: null,
      position: 0,
      estimatedMinutes: undefined,
      dueDate: undefined,
      images: [],
      assignees: [],
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you would upload these to a file storage service
      // For now, we'll create preview URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (imageToRemove: string) => {
    setUploadedImages(prev => prev.filter(img => img !== imageToRemove));
  };

  const onSubmit = async (data: ExtendedTaskFormData) => {
    try {
      const taskData = {
        ...data,
        assigneeId: selectedAssignees[0] || null, // For now, just use the first assignee
        projectId: data.projectId || projectId || '',
      };
      
      await createTask.mutateAsync(taskData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const mockUsers = [
    { id: '1', name: 'João Silva', avatar: '', initials: 'JS' },
    { id: '2', name: 'Maria Santos', avatar: '', initials: 'MS' },
    { id: '3', name: 'Pedro Costa', avatar: '', initials: 'PC' },
  ];

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Criar nova tarefa
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Título da tarefa */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Título da tarefa</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Título da tarefa" 
                      className="text-lg"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alocados */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <label className="text-base font-semibold">Alocados</label>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-12 w-12 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-12 w-12 rounded-lg border-2 border-dashed"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>

                <Select onValueChange={(value) => setSelectedAssignees([value])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quem trabalhará na tarefa?" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quadro/Projeto */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <label className="text-base font-semibold">Quadro</label>
                </div>
                
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Desenvolvimento de software" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects?.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo/Prioridade */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <label className="text-base font-semibold">Tipo</label>
                </div>
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="O que essa pessoa irá fazer?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgente</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="low">Baixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Projeto */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <label className="text-base font-semibold">Projeto</label>
                </div>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Em qual projeto?" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="border rounded-lg p-3 min-h-[200px]">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <Button type="button" variant="ghost" size="sm">Normal</Button>
                          <Button type="button" variant="ghost" size="sm"><strong>B</strong></Button>
                          <Button type="button" variant="ghost" size="sm"><em>I</em></Button>
                          <Button type="button" variant="ghost" size="sm"><u>U</u></Button>
                          <Button type="button" variant="ghost" size="sm">S</Button>
                          <Button type="button" variant="ghost" size="sm">A</Button>
                          <Button type="button" variant="ghost" size="sm">🔗</Button>
                          <Button type="button" variant="ghost" size="sm">📋</Button>
                        </div>
                        <Textarea
                          placeholder="Digite uma breve descrição para a tarefa aqui..."
                          className="border-none resize-none min-h-[150px] p-0 focus-visible:ring-0"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload de imagens */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Anexar imagens
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(image)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Descartar
              </Button>
              <div className="flex gap-2">
                <Button type="submit" variant="outline">
                  Salvar
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Salvar e Criar outra
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}