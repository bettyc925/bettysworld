import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Monitor, 
  Focus, 
  Image as ImageIcon,
  X,
  Sparkles,
  Mountain,
  Building,
  Waves,
  TreePine,
  Palette
} from 'lucide-react';
import type { BackgroundMode } from '@/utils/VideoBackgroundProcessor';

interface BackgroundSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: BackgroundMode;
  onModeChange: (mode: BackgroundMode) => void;
  onBlurAmountChange: (amount: number) => void;
  onBackgroundImageChange: (imageUrl: string) => void;
  blurAmount: number;
}

const BackgroundSettings = ({
  isOpen,
  onClose,
  currentMode,
  onModeChange,
  onBlurAmountChange,
  onBackgroundImageChange,
  blurAmount
}: BackgroundSettingsProps) => {
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Sample background images (you can replace with actual URLs)
  const backgroundImages = [
    {
      id: 'office',
      name: 'Modern Office',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      icon: Building
    },
    {
      id: 'nature',
      name: 'Mountain View',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      icon: Mountain
    },
    {
      id: 'beach',
      name: 'Ocean Beach',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      icon: Waves
    },
    {
      id: 'forest',
      name: 'Forest Path',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      icon: TreePine
    },
    {
      id: 'gradient1',
      name: 'Purple Gradient',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjdlZWEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+',
      icon: Palette
    },
    {
      id: 'gradient2',
      name: 'Blue Gradient',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZDRlZDgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+',
      icon: Palette
    }
  ];

  const handleModeSelect = (mode: BackgroundMode) => {
    onModeChange(mode);
    if (mode === 'image' && selectedImage) {
      onBackgroundImageChange(selectedImage);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onBackgroundImageChange(imageUrl);
    onModeChange('image');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Background Effects
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Background Mode Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Background Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={currentMode === 'none' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2"
                onClick={() => handleModeSelect('none')}
              >
                <Monitor className="w-6 h-6" />
                <span className="text-xs">None</span>
              </Button>
              
              <Button
                variant={currentMode === 'blur' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2"
                onClick={() => handleModeSelect('blur')}
              >
                <Focus className="w-6 h-6" />
                <span className="text-xs">Blur</span>
              </Button>
              
              <Button
                variant={currentMode === 'image' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2"
                onClick={() => handleModeSelect('image')}
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs">Virtual</span>
              </Button>
            </div>
          </div>

          {/* Blur Amount Slider */}
          {currentMode === 'blur' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Blur Intensity</Label>
              <div className="px-2">
                <Slider
                  value={[blurAmount]}
                  onValueChange={(value) => onBlurAmountChange(value[0])}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Light</span>
                  <span>{blurAmount}px</span>
                  <span>Heavy</span>
                </div>
              </div>
            </div>
          )}

          {/* Virtual Background Images */}
          {currentMode === 'image' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose Background</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {backgroundImages.map((bg) => {
                  const IconComponent = bg.icon;
                  return (
                    <Button
                      key={bg.id}
                      variant={selectedImage === bg.url ? 'default' : 'outline'}
                      className="h-24 flex-col gap-2 p-2 relative overflow-hidden"
                      onClick={() => handleImageSelect(bg.url)}
                    >
                      {bg.url.startsWith('data:image/svg') ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <IconComponent className="w-8 h-8" />
                        </div>
                      ) : (
                        <div className="absolute inset-0">
                          <img 
                            src={bg.url} 
                            alt={bg.name}
                            className="w-full h-full object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded" />
                        </div>
                      )}
                      <span className="text-xs font-medium relative z-10 text-center">
                        {bg.name}
                      </span>
                      {selectedImage === bg.url && (
                        <Badge className="absolute top-1 right-1 text-xs">
                          Active
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tips:</strong>
              {currentMode === 'none' && " Your natural background will be visible."}
              {currentMode === 'blur' && " Blur helps maintain privacy while keeping some context."}
              {currentMode === 'image' && " Virtual backgrounds work best with good lighting and a plain background."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Apply Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackgroundSettings;