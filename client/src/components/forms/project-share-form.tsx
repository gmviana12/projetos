import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertProjectMemberSchema } from '@shared/schema';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Mail, UserPlus, Trash2, Crown, User } from 'lucide-react';
import { useProjectMembers } from '@/hooks/use-project-members';
import { Project, ProjectMember, User as UserType } from '@shared/schema';

type ProjectMemberFormData = z.infer<typeof insertProjectMemberSchema>;

interface ProjectShareFormProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectShareForm({ project, isOpen, onClose }: ProjectShareFormProps) {
  const { members, addMember, removeMember } = useProjectMembers(project.id);
  const [inviteEmail, setInviteEmail] = useState('');

  const form = useForm<ProjectMemberFormData>({
    resolver: zodResolver(insertProjectMemberSchema),
    defaultValues: {
      projectId: project.id,
      userId: '',
      role: 'member',
    },
  });

  // Mock user search - in a real app, this would be an API call
  const mockUsers = [
    { id: '1', email: 'joao@empresa.com', fullName: 'João Silva', avatarUrl: null },
    { id: '2', email: 'maria@empresa.com', fullName: 'Maria Santos', avatarUrl: null },
    { id: '3', email: 'pedro@empresa.com', fullName: 'Pedro Costa', avatarUrl: null },
  ];

  const handleInviteByEmail = async () => {
    if (!inviteEmail.trim()) return;

    // Mock finding user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === inviteEmail.toLowerCase());
    
    if (user) {
      try {
        await addMember.mutateAsync({
          projectId: project.id,
          userId: user.id,
          role: 'member',
        });
        setInviteEmail('');
      } catch (error) {
        console.error('Failed to add member:', error);
      }
    } else {
      // In a real app, you'd send an invitation email
      alert('Usuário não encontrado. Em uma implementação real, seria enviado um convite por email.');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember.mutateAsync(memberId);
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Proprietário';
      case 'admin':
        return 'Administrador';
      case 'member':
        return 'Membro';
      default:
        return role;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Compartilhar Projeto: {project.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Convidar por email */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <h3 className="font-semibold">Convidar por email</h3>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o email do usuário..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleInviteByEmail()}
                  />
                  <Button onClick={handleInviteByEmail} disabled={!inviteEmail.trim()}>
                    Convidar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Lista de membros */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Membros do projeto ({(members?.length || 0) + 1})</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {(members?.length || 0) + 1} membros
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Proprietário do projeto */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {project.owner?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{project.owner?.fullName || 'Proprietário'}</p>
                        <p className="text-sm text-gray-500">{project.owner?.email || 'email@exemplo.com'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleIcon('owner')}
                      <Badge variant="secondary">{getRoleLabel('owner')}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Membros adicionados */}
              {members?.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.user.avatarUrl || ''} />
                          <AvatarFallback>
                            {member.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.user.fullName}</p>
                          <p className="text-sm text-gray-500">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <Badge variant="outline">{getRoleLabel(member.role)}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.userId)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Configurações de compartilhamento */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Configurações de acesso</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Permissão padrão para novos membros</label>
                    <Select defaultValue="member">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Membro (visualizar e editar tarefas)</SelectItem>
                        <SelectItem value="admin">Administrador (gerenciar projeto)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Visibilidade do projeto</label>
                    <Select defaultValue="private">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Privado (apenas membros)</SelectItem>
                        <SelectItem value="internal">Interno (todos da empresa)</SelectItem>
                        <SelectItem value="public">Público (qualquer pessoa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Link de compartilhamento */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Link de convite</h3>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/invite/${project.id}`}
                    className="bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/invite/${project.id}`)}
                  >
                    Copiar
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Qualquer pessoa com este link poderá solicitar acesso ao projeto.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}