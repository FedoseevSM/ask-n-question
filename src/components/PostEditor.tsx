import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
'./ui/dialog';
import { TagInput } from './TagInput';
import { MarkdownPreview } from './MarkdownPreview';
import { config } from '../config/github';
import { transliterate } from '../utils/transliterate';
import { createPost } from '../services/github';
import { toast } from 'sonner';
import {
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Send,
  Save } from
'lucide-react';
export function PostEditor() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [author, setAuthor] = useState(config.DEFAULT_AUTHOR);
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState('');
  // Advanced Form State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastmod, setLastmod] = useState('');
  const [image, setImage] = useState('');
  const [math, setMath] = useState(false);
  const [toc, setToc] = useState(true);
  const [comments, setComments] = useState(true);
  const [weight, setWeight] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [license, setLicense] = useState('');
  const [hiddenFromHomePage, setHiddenFromHomePage] = useState(false);
  const [links, setLinks] = useState<
    {
      title: string;
      url: string;
    }[]>(
    []);
  useEffect(() => {
    if (title && !slug) {
      setSlug(transliterate(title));
    }
  }, [title]);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(transliterate(newTitle));
  };
  const addLink = () => {
    setLinks([
    ...links,
    {
      title: '',
      url: ''
    }]
    );
  };
  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };
  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };
  const generateFrontmatter = () => {
    let fm = '---\n';
    fm += `title: "${title.replace(/"/g, '\\"')}"\n`;
    if (date) fm += `date: ${date}\n`;
    if (slug) fm += `slug: "${slug}"\n`;
    if (author) fm += `author: "${author}"\n`;
    fm += `draft: ${draft}\n`;
    if (summary) fm += `summary: "${summary.replace(/"/g, '\\"')}"\n`;
    if (tags.length > 0) {
      fm += `tags: [${tags.map((t) => `"${t}"`).join(', ')}]\n`;
    }
    if (categories.length > 0) {
      fm += `categories: [${categories.map((c) => `"${c}"`).join(', ')}]\n`;
    }
    if (lastmod) fm += `lastmod: ${lastmod}\n`;
    if (image) fm += `image: "${image}"\n`;
    if (math) fm += `math: true\n`;
    if (!toc) fm += `toc: false\n`;
    if (!comments) fm += `comments: false\n`;
    if (weight) fm += `weight: ${weight}\n`;
    if (readingTime) fm += `readingTime: ${readingTime}\n`;
    if (license) fm += `license: "${license}"\n`;
    if (hiddenFromHomePage) fm += `hiddenFromHomePage: true\n`;
    if (links.length > 0) {
      const validLinks = links.filter((l) => l.title && l.url);
      if (validLinks.length > 0) {
        fm += `links:\n`;
        validLinks.forEach((link) => {
          fm += `  - title: "${link.title}"\n`;
          fm += `    url: "${link.url}"\n`;
        });
      }
    }
    fm += '---\n\n';
    return fm;
  };
  const handlePublish = async (isDraft: boolean) => {
    if (!title || !slug) {
      toast.error('Заголовок и URL (slug) обязательны');
      return;
    }
    setIsLoading(true);
    setShowConfirm(false);
    const originalDraftState = draft;
    if (isDraft) setDraft(true);
    const fullContent = generateFrontmatter() + content;
    const result = await createPost(slug, fullContent, title);
    if (result.success) {
      toast.success(isDraft ? 'Черновик сохранен' : 'Пост успешно опубликован!');
      setTitle('');
      setSlug('');
      setContent('');
      setSummary('');
      setTags([]);
      setCategories([]);
    } else {
      toast.error(`Ошибка: ${result.error}`);
      if (isDraft) setDraft(originalDraftState);
    }
    setIsLoading(false);
  };
  const frontmatterData = {
    title,
    date,
    author,
    summary,
    tags,
    categories,
    draft,
    readingTime
  };
  return (
    <div className="w-full px-3 sm:px-4 py-3 sm:py-6 mx-auto max-w-7xl">
      {/* Mobile Action Bar */}
      <div className="flex items-center gap-2 mb-3 sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePublish(true)}
          disabled={isLoading}
          className="flex-1 h-9">
          
          <Save className="h-4 w-4 mr-1.5" />
          Черновик
        </Button>
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={isLoading} className="flex-1 h-9">
              {isLoading ?
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> :

              <Send className="h-4 w-4 mr-1.5" />
              }
              Опубликовать
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 max-w-[calc(100vw-2rem)]">
            <DialogHeader>
              <DialogTitle>Опубликовать пост?</DialogTitle>
              <DialogDescription>
                Пост будет отправлен в репозиторий GitHub и станет доступен на
                сайте.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1">
                
                Отмена
              </Button>
              <Button onClick={() => handlePublish(false)} className="flex-1">
                Подтвердить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:h-[calc(100vh-5rem)]">
        {/* Left Column - Editor */}
        <div className="w-full lg:w-1/2 flex flex-col lg:h-full lg:overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col lg:h-full">
            
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="edit" className="text-sm">
                  Редактор
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-sm lg:hidden">
                  Предпросмотр
                </TabsTrigger>
              </TabsList>

              {/* Desktop Action Buttons */}
              <div className="hidden sm:flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePublish(true)}
                  disabled={isLoading}>
                  
                  <Save className="h-4 w-4 mr-1.5" />
                  Сохранить черновик
                </Button>
                <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={isLoading}>
                      {isLoading ?
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> :

                      <Send className="h-4 w-4 mr-1.5" />
                      }
                      Опубликовать
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Опубликовать пост?</DialogTitle>
                      <DialogDescription>
                        Пост будет отправлен в репозиторий GitHub и станет
                        доступен на сайте.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirm(false)}>
                        
                        Отмена
                      </Button>
                      <Button onClick={() => handlePublish(false)}>
                        Подтвердить
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent
              value="edit"
              className="flex-1 lg:overflow-y-auto lg:pr-2 space-y-4 sm:space-y-6 mt-0">
              
              {/* Essential Fields */}
              <Card>
                <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm">
                      Заголовок *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="Введите заголовок поста"
                      className="h-10 sm:h-9" />
                    
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="slug" className="text-sm">
                        URL (Slug) *
                      </Label>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="post-url"
                        className="h-10 sm:h-9" />
                      
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="date" className="text-sm">
                        Дата
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-10 sm:h-9" />
                      
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="summary" className="text-sm">
                      Краткое описание
                    </Label>
                    <Textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Краткое описание для карточки поста..."
                      rows={2} />
                    
                  </div>

                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">Категории</Label>
                      <TagInput
                        tags={categories}
                        onChange={setCategories}
                        placeholder="Добавить категорию..." />
                      
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Теги</Label>
                      <TagInput
                        tags={tags}
                        onChange={setTags}
                        placeholder="Добавить тег..." />
                      
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <Switch
                      id="draft"
                      checked={draft}
                      onCheckedChange={setDraft} />
                    
                    <Label htmlFor="draft" className="text-sm">
                      Черновик
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card className="flex flex-col">
                <CardHeader className="py-2.5 sm:py-3 px-3 sm:px-6">
                  <CardTitle className="text-sm font-medium">
                    Текст поста (Markdown)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Напишите ваш пост здесь..."
                    className="min-h-[250px] sm:min-h-[400px] border-0 focus-visible:ring-0 rounded-none font-mono resize-y p-3 sm:p-4 text-sm" />
                  
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card>
                <CardHeader
                  className="py-2.5 sm:py-3 px-3 sm:px-6 cursor-pointer select-none"
                  onClick={() => setShowAdvanced(!showAdvanced)}>
                  
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Дополнительные настройки
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      {showAdvanced ?
                      <ChevronUp className="h-4 w-4" /> :

                      <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </CardHeader>
                {showAdvanced &&
                <CardContent className="space-y-4 pt-0 px-3 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="author" className="text-sm">
                          Автор
                        </Label>
                        <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="h-10 sm:h-9" />
                      
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="image" className="text-sm">
                          Обложка (URL)
                        </Label>
                        <Input
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="/img/cover.jpg"
                        className="h-10 sm:h-9" />
                      
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="readingTime" className="text-sm">
                          Время чтения (мин)
                        </Label>
                        <Input
                        id="readingTime"
                        type="number"
                        value={readingTime}
                        onChange={(e) => setReadingTime(e.target.value)}
                        className="h-10 sm:h-9" />
                      
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="weight" className="text-sm">
                          Вес (сортировка)
                        </Label>
                        <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-10 sm:h-9" />
                      
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastmod" className="text-sm">
                          Дата изменения
                        </Label>
                        <Input
                        id="lastmod"
                        type="date"
                        value={lastmod}
                        onChange={(e) => setLastmod(e.target.value)}
                        className="h-10 sm:h-9" />
                      
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="license" className="text-sm">
                          Лицензия
                        </Label>
                        <Input
                        id="license"
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                        placeholder="CC BY-NC-SA 4.0"
                        className="h-10 sm:h-9" />
                      
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                        id="toc"
                        checked={toc}
                        onCheckedChange={setToc} />
                      
                        <Label htmlFor="toc" className="text-sm">
                          Оглавление
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                        id="comments"
                        checked={comments}
                        onCheckedChange={setComments} />
                      
                        <Label htmlFor="comments" className="text-sm">
                          Комментарии
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                        id="math"
                        checked={math}
                        onCheckedChange={setMath} />
                      
                        <Label htmlFor="math" className="text-sm">
                          Формулы
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                        id="hidden"
                        checked={hiddenFromHomePage}
                        onCheckedChange={setHiddenFromHomePage} />
                      
                        <Label htmlFor="hidden" className="text-sm">
                          Скрыть
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Ссылки</Label>
                        <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLink}
                        className="h-7">
                        
                          <Plus className="h-3.5 w-3.5 mr-1" /> Добавить
                        </Button>
                      </div>
                      {links.map((link, index) =>
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-2">
                      
                          <Input
                        placeholder="Название"
                        value={link.title}
                        onChange={(e) =>
                        updateLink(index, 'title', e.target.value)
                        }
                        className="h-10 sm:h-9" />
                      
                          <div className="flex gap-2">
                            <Input
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) =>
                          updateLink(index, 'url', e.target.value)
                          }
                          className="flex-1 h-10 sm:h-9" />
                        
                            <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLink(index)}
                          className="h-10 w-10 sm:h-9 sm:w-9 shrink-0">
                          
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                    )}
                    </div>
                  </CardContent>
                }
              </Card>

              {/* Bottom spacer for mobile */}
              <div className="h-4 sm:h-0" />
            </TabsContent>

            <TabsContent
              value="preview"
              className="flex-1 overflow-hidden mt-0 lg:hidden">
              
              <div className="h-[calc(100vh-12rem)] overflow-y-auto">
                <MarkdownPreview
                  frontmatter={frontmatterData}
                  content={content} />
                
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Preview (Desktop Only) */}
        <div className="hidden lg:block lg:w-1/2 lg:h-full">
          <div className="h-full border rounded-lg overflow-hidden bg-card">
            <div className="bg-muted px-4 py-2 border-b">
              <span className="text-sm font-medium text-muted-foreground">
                Предпросмотр
              </span>
            </div>
            <div className="h-[calc(100%-41px)]">
              <MarkdownPreview
                frontmatter={frontmatterData}
                content={content} />
              
            </div>
          </div>
        </div>
      </div>
    </div>);

}