import React, { useState } from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}
export function TagInput({
  tags,
  onChange,
  placeholder = 'Введите тег и нажмите Enter'
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };
  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) =>
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1">
          
            {tag}
            <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-muted-foreground hover:text-foreground focus:outline-none">
            
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1" />
      
    </div>);

}