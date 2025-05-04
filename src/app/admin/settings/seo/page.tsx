'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  SearchIcon, 
  Save, 
  Code,
  Info,
  XCircle,
  Plus,
  Trash2,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOut } from '@/lib/new/auth';
import { useAdminAuth } from '@/hooks/use-admin-auth'; // Corrected import path

// Mock SEO API client since implementation might be missing
const useSeoApi = () => {
  return {
    getSeoSettings: async () => {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return {
        title: 'AI Haven Labs',
        description: 'AI solutions and research for enterprises and developers',
        keywords: 'AI, machine learning, neural networks, artificial intelligence',
        allowIndexing: true,
        ogTitle: 'AI Haven Labs',
        ogDescription: 'Leading the future of AI development and research',
        ogImage: '/images/og-image.jpg',
        twitterCard: 'summary_large_image',
        twitterImage: '/images/twitter-card.jpg',
        twitterHandle: '@aihavenlabs',
        sitemapLastGenerated: '2025-04-30T10:15:00Z',
        sitemapStatus: 'active',
        sitemapFrequency: 'weekly',
        sitemapPriority: '0.8',
        robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://aihavenlabs.com/sitemap.xml',
        jsonLd: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "AI Haven Labs",\n  "url": "https://aihavenlabs.com"\n}',
        canonicalUrl: 'https://aihavenlabs.com',
        alternateLanguages: {
          'es': 'https://aihavenlabs.com/es',
          'fr': 'https://aihavenlabs.com/fr'
        },
        favicon: '/favicon.ico',
        themeColor: '#4f46e5',
        metaRobots: 'index, follow',
        twitterSite: '@aihavenlabs',
        twitterCreator: '@aihavenlabs',
        fbAppId: '123456789',
        ogLocale: 'en_US',
        ogType: 'website',
        ogSiteName: 'AI Haven Labs'
      };
    },
    saveSeoSettings: async (data: SEOData) => {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving SEO settings:', data);
      return { success: true };
    },
    generateSitemap: async (options: { frequency: string; priority: string }) => {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Generating sitemap with options:', options);
      return { success: true };
    }
  };
};

export type SEOData = {
  title: string;
  description: string;
  keywords: string;
  allowIndexing: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterImage: string;
  twitterHandle: string;
  sitemapLastGenerated: string;
  sitemapStatus: string;
  sitemapFrequency: string;
  sitemapPriority: string;
  robotsTxt: string;
  jsonLd: string;
  canonicalUrl: string;
  // New fields
  alternateLanguages: Record<string, string>;
  favicon: string;
  themeColor: string;
  metaRobots: string;
  twitterSite: string;
  twitterCreator: string;
  fbAppId: string;
  ogLocale: string;
  ogType: string;
  ogSiteName: string;
};

// Simple Toast implementation if react-hot-toast isn't available
const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // You can implement a proper toast system here
  },
  error: (message: string) => {
    console.error('❌ Error:', message);
    // You can implement a proper toast system here
  }
};

export default function SEOSettings() { 
  const { adminData, loading } = useAdminAuth();
  const router = useRouter();

  const seoApi = useSeoApi();
  
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    description: '',
    keywords: '',
    allowIndexing: true,
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary',
    twitterImage: '',
    twitterHandle: '',
    sitemapLastGenerated: '',
    sitemapStatus: 'inactive',
    sitemapFrequency: 'weekly',
    sitemapPriority: '0.8',
    robotsTxt: '',
    jsonLd: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "AI Haven Labs",\n  "url": "https://aihavenlabs.com"\n}',
    canonicalUrl: 'https://aihavenlabs.com',
    // Initialize new fields
    alternateLanguages: {},
    favicon: '/favicon.ico',
    themeColor: '#ffffff',
    metaRobots: 'index, follow',
    twitterSite: '@aihavenlabs',
    twitterCreator: '@aihavenlabs',
    fbAppId: '',
    ogLocale: 'en_US',
    ogType: 'website',
    ogSiteName: 'AI Haven Labs'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSitemap, setIsGeneratingSitemap] = useState(false);
  const [robotsDialogOpen, setRobotsDialogOpen] = useState(false);
  const [tempRobotsTxt, setTempRobotsTxt] = useState('');
  const [jsonLdDialogOpen, setJsonLdDialogOpen] = useState(false);
  const [tempJsonLd, setTempJsonLd] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [alternateLanguageDialogOpen, setAlternateLanguageDialogOpen] = useState(false);
  const [tempLanguageCode, setTempLanguageCode] = useState('');
  const [tempLanguageUrl, setTempLanguageUrl] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await seoApi.getSeoSettings();
        setSeoData({
          ...seoData,
          ...data,
          alternateLanguages: data.alternateLanguages || {}
        });
      } catch (error) {
        console.error('Error loading SEO settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Validate input based on SEO best practices
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'title':
        return value.length > 60 ? 'Title should be 60 characters or less' : null;
      case 'description':
        return value.length > 160 ? 'Description should be 160 characters or less' : null;
      case 'keywords':
        return value.split(',').length > 10 ? 'Limit to 10 keywords or less' : null;
      case 'ogTitle':
        return value.length > 60 ? 'OG Title should be 60 characters or less' : null;
      case 'ogDescription':
        return value.length > 160 ? 'OG Description should be 160 characters or less' : null;
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Check for validation errors
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    
    setSeoData((prev: SEOData) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setSeoData((prev: SEOData) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSeoData((prev: SEOData) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate all fields before saving
      const errors: Record<string, string> = {};
      Object.entries(seoData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          const error = validateField(key, value);
          if (error) errors[key] = error;
        }
      });
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        throw new Error('Validation failed');
      }
  
      // Use the API client instead of direct fetch
      await seoApi.saveSeoSettings(seoData);
      toast.success("Settings saved. Your SEO settings have been updated successfully.");
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error(
        error instanceof Error && error.message === 'Validation failed' 
          ? "Please fix the validation errors and try again."
          : "Could not save SEO settings. Please try again later."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const generateSitemap = async () => {
    setIsGeneratingSitemap(true);
    try {
      // Use the API client instead of direct fetch
      await seoApi.generateSitemap({
        frequency: seoData.sitemapFrequency,
        priority: seoData.sitemapPriority
      });
      
      // Update last generated time
      setSeoData(prev => ({
        ...prev,
        sitemapLastGenerated: new Date().toISOString(),
        sitemapStatus: "active"
      }));
      
      toast.success("Sitemap generated. Your sitemap has been successfully generated.");
    } catch (error) {
      console.error("Failed to generate sitemap", error);
      setSeoData(prev => ({ ...prev, sitemapStatus: "error" }));
      
      toast.error("Sitemap generation failed. Could not generate sitemap. Please try again later.");
    } finally {
      setIsGeneratingSitemap(false);
    }
  };

  const openRobotsDialog = () => {
    setTempRobotsTxt(seoData.robotsTxt);
    setRobotsDialogOpen(true);
  };

  const saveRobotsTxt = () => {
    setSeoData(prev => ({ ...prev, robotsTxt: tempRobotsTxt }));
    setRobotsDialogOpen(false);
    toast.success("Robots.txt updated. Remember to save all changes to apply.");
  };

  const openJsonLdDialog = () => {
    setTempJsonLd(seoData.jsonLd);
    setJsonLdDialogOpen(true);
  };

  const saveJsonLd = () => {
    try {
      // Validate JSON
      JSON.parse(tempJsonLd);
      setSeoData(prev => ({ ...prev, jsonLd: tempJsonLd }));
      setJsonLdDialogOpen(false);
      toast.success("JSON-LD updated. Don't forget to save your changes.");
    } catch {
      toast.error("Invalid JSON format. Please check your syntax.");
    }
  };

  const addAlternateLanguage = () => {
    if (!tempLanguageCode || !tempLanguageUrl) {
      toast.error("Please enter both language code and URL");
      return;
    }

    setSeoData(prev => ({
      ...prev,
      alternateLanguages: {
        ...prev.alternateLanguages,
        [tempLanguageCode]: tempLanguageUrl
      }
    }));

    setTempLanguageCode('');
    setTempLanguageUrl('');
    setAlternateLanguageDialogOpen(false);
    toast.success("Language variant added");
  };

  const removeAlternateLanguage = (langCode: string) => {
    setSeoData(prev => {
      const updated = { ...prev.alternateLanguages };
      delete updated[langCode];
      return { ...prev, alternateLanguages: updated };
    });
    toast.success("Language variant removed");
  };

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-950 text-gray-200 min-h-screen">
      <div className="flex flex-col justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex justify-between md:items-center mb-8 gap-4 w-full">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => router.push('/admin/settings')}
              title="Back to Settings"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">SEO Settings</h1>
              <p className="text-gray-400">Optimize your site for search engines</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 border border-gray-700 rounded-full py-2 px-4 bg-gray-900">
              {adminData?.avatarUrl ? (
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <Image 
                    src={adminData.avatarUrl} 
                    alt={adminData.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {adminData?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-medium text-white">{adminData?.name}</div>
                <div className="text-xs text-gray-400 capitalize">{adminData?.role}</div>
              </div>
            </div>
            
            <Button 
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row border-2 cursor-pointer border-white rounded-2xl sm:justify-between sm:items-center gap-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || Object.values(validationErrors).some(error => error)}
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main SEO Settings */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Global Meta Tags</CardTitle>
                      <CardDescription>
                        These settings affect how your site appears in search results
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="seo-title">Title Template</Label>
                          <span className={`text-xs ${seoData.title.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {seoData.title.length}/60
                          </span>
                        </div>
                        <Input
                          id="seo-title"
                          name="title"
                          value={seoData.title}
                          onChange={handleInputChange}
                          placeholder="%s | Site Name"
                          className={validationErrors.title ? 'border-red-500' : ''}
                        />
                        {validationErrors.title && (
                          <p className="text-sm text-red-500">
                            {validationErrors.title}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Use %s to insert dynamic page titles (e.g., &quot;%s | AI Haven Labs&quot;)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="seo-description">Meta Description</Label>
                          <span className={`text-xs ${seoData.description.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {seoData.description.length}/160
                          </span>
                        </div>
                        <Textarea
                          id="seo-description"
                          name="description"
                          value={seoData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className={validationErrors.description ? 'border-red-500' : ''}
                        />
                        {validationErrors.description && (
                          <p className="text-sm text-red-500">
                            {validationErrors.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seo-keywords">Keywords</Label>
                        <Input
                          id="seo-keywords"
                          name="keywords"
                          value={seoData.keywords}
                          onChange={handleInputChange}
                          className={validationErrors.keywords ? 'border-red-500' : ''}
                        />
                        {validationErrors.keywords && (
                          <p className="text-sm text-red-500">
                            {validationErrors.keywords}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Comma-separated list of keywords (e.g., &quot;AI, tools, productivity&quot;)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="canonical-url">Canonical URL Base</Label>
                        <Input
                          id="canonical-url"
                          name="canonicalUrl"
                          value={seoData.canonicalUrl}
                          onChange={handleInputChange}
                          placeholder="https://aihavenlabs.com"
                        />
                        <p className="text-sm text-muted-foreground">
                          Base URL used for canonical links (helps prevent duplicate content issues)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="robots-meta">Meta Robots</Label>
                        <Input
                          id="robots-meta"
                          name="metaRobots"
                          value={seoData.metaRobots}
                          onChange={handleInputChange}
                          placeholder="index, follow"
                        />
                        <p className="text-sm text-muted-foreground">
                          Fine-grained control over how search engines crawl your site
                        </p>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <Label>Search Engine Indexing</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow search engines to index this site
                          </p>
                        </div>
                        <Switch
                          checked={seoData.allowIndexing}
                          onCheckedChange={(checked) => handleToggleChange('allowIndexing', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Card */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Search Preview</CardTitle>
                      <CardDescription>How your site appears in search results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md p-4 bg-white space-y-2">
                        <div className="text-blue-600 text-lg font-medium truncate">
                          {seoData.title.replace('%s', 'Page Title')}
                        </div>
                        <div className="text-green-600 text-sm truncate">
                          {seoData.canonicalUrl}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-3">
                          {seoData.description || "No description provided."}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Preview based on Google search results
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {seoData.title && seoData.title.length <= 60 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>Title Length</span>
                        </div>
                        <Badge variant={seoData.title && seoData.title.length <= 60 ? "default" : "destructive"}>
                          {seoData.title ? `${seoData.title.length}/60` : "Missing"}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {seoData.description && seoData.description.length <= 160 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>Description</span>
                        </div>
                        <Badge variant={seoData.description && seoData.description.length <= 160 ? "default" : "destructive"}>
                          {seoData.description ? `${seoData.description.length}/160` : "Missing"}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {seoData.ogImage ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span>OG Image</span>
                        </div>
                        <Badge variant={seoData.ogImage ? "default" : "secondary"}>
                          {seoData.ogImage ? "Set" : "Not Set"}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {seoData.sitemapStatus === 'active' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span>Sitemap</span>
                        </div>
                        <Badge variant={seoData.sitemapStatus === 'active' ? "default" : "secondary"}>
                          {seoData.sitemapStatus}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* OpenGraph Settings */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>OpenGraph (Facebook/LinkedIn)</CardTitle>
                      <CardDescription>
                        Control how your content appears when shared on Facebook and LinkedIn
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="og-title">OG Title</Label>
                          <span className={`text-xs ${seoData.ogTitle.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {seoData.ogTitle.length}/60
                          </span>
                        </div>
                        <Input
                          id="og-title"
                          name="ogTitle"
                          value={seoData.ogTitle}
                          onChange={handleInputChange}
                          placeholder="Leave blank to use meta title"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="og-description">OG Description</Label>
                          <span className={`text-xs ${seoData.ogDescription.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {seoData.ogDescription.length}/160
                          </span>
                        </div>
                        <Textarea
                          id="og-description"
                          name="ogDescription"
                          value={seoData.ogDescription}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Leave blank to use meta description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="og-site-name">OG Site Name</Label>
                        <Input
                          id="og-site-name"
                          name="ogSiteName"
                          value={seoData.ogSiteName}
                          onChange={handleInputChange}
                          placeholder="AI Haven Labs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="og-type">OG Type</Label>
                        <Select 
                          value={seoData.ogType} 
                          onValueChange={(value) => handleSelectChange('ogType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select OG type" />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="profile">Profile</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Defines the type of content you&apos;re sharing
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="og-locale">OG Locale</Label>
                        <Input
                          id="og-locale"
                          name="ogLocale"
                          value={seoData.ogLocale}
                          onChange={handleInputChange}
                          placeholder="en_US"
                        />
                        <p className="text-sm text-muted-foreground">
                          Language and territory (e.g., en_US, fr_FR)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fb-app-id">Facebook App ID</Label>
                        <Input
                          id="fb-app-id"
                          name="fbAppId"
                          value={seoData.fbAppId}
                          onChange={handleInputChange}
                          placeholder="123456789012345"
                        />
                        <p className="text-sm text-muted-foreground">
                          Connect your content with your Facebook page insights
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="og-image">OG Image URL</Label>
                        <Input
                          id="og-image"
                          name="ogImage"
                          value={seoData.ogImage}
                          onChange={handleInputChange}
                          placeholder="https://aihavenlabs.com/og-image.jpg"
                        />
                        <p className="text-sm text-muted-foreground">
                          Recommended size: 1200×630 pixels
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Twitter Settings */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Twitter Card</CardTitle>
                      <CardDescription>
                        Control how your content appears when shared on Twitter
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Twitter Card Type</Label>
                          <Select 
                            value={seoData.twitterCard} 
                            onValueChange={(value) => handleSelectChange('twitterCard', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select card type" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                              <SelectItem value="summary">Summary</SelectItem>
                              <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter-handle">Twitter Handle</Label>
                          <Input
                            id="twitter-handle"
                            name="twitterHandle"
                            value={seoData.twitterHandle}
                            onChange={handleInputChange}
                            placeholder="@aihavenlabs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="twitter-site">Site Twitter Handle</Label>
                          <Input
                            id="twitter-site"
                            name="twitterSite"
                            value={seoData.twitterSite}
                            onChange={handleInputChange}
                            placeholder="@aihavenlabs"
                          />
                          <p className="text-sm text-muted-foreground">
                            The Twitter handle for your site
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter-creator">Creator Twitter Handle</Label>
                          <Input
                            id="twitter-creator"
                            name="twitterCreator"
                            value={seoData.twitterCreator}
                            onChange={handleInputChange}
                            placeholder="@yourusername"
                          />
                          <p className="text-sm text-muted-foreground">
                            The Twitter handle for the content author
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter-image">Twitter Image URL</Label>
                        <Input
                          id="twitter-image"
                          name="twitterImage"
                          value={seoData.twitterImage}
                          onChange={handleInputChange}
                          placeholder="Leave blank to use OG image"
                        />
                        <p className="text-sm text-muted-foreground">
                          Recommended size: 1200×600 pixels (or 800×418 pixels for summary card)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Social Preview */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Preview</CardTitle>
                      <CardDescription>
                        How your content appears when shared on social media
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border rounded-md p-3 bg-gray-50 space-y-2">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-md mb-2">
                          {seoData.ogImage ? (                            
                            <Image 
                              src="/api/placeholder/1200/630" 
                              alt="OG Preview" 
                              className="rounded-md max-w-full"
                              width={1200}
                              height={630}
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <SearchIcon className="mx-auto h-8 w-8 mb-2" />
                              <p>No image set</p>
                            </div>
                          )}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {seoData.ogTitle || seoData.title.replace('%s', 'Page Title')}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {seoData.ogDescription || seoData.description || "No description provided."}
                        </div>
                        <div className="text-xs text-gray-500">
                          {seoData.canonicalUrl}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-center mt-4">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          This is an approximate preview
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Theme and Favicon */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Theme & Branding</CardTitle>
                      <CardDescription>
                        Configure visual elements and branding information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="favicon-url">Favicon URL</Label>
                        <Input
                          id="favicon-url"
                          name="favicon"
                          value={seoData.favicon}
                          onChange={handleInputChange}
                          placeholder="/icons/pathway/favicon.ico"
                        />
                        <p className="text-sm text-muted-foreground">
                          Path to your site favicon (usually /favicon.ico)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theme-color">Theme Color</Label>
                        <div className="flex gap-3">
                          <Input
                            type="color"
                            id="theme-color-picker"
                            value={seoData.themeColor}
                            onChange={(e) => handleSelectChange('themeColor', e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            id="theme-color"
                            name="themeColor"
                            value={seoData.themeColor}
                            onChange={handleInputChange}
                            placeholder="#ffffff"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Color for browser UI when site is pinned on mobile devices
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alternate Language */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Language Variants (hreflang)</CardTitle>
                      <CardDescription>
                        Help search engines show the right language version to users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Alternate Language URLs</Label>
                        <Button 
                          onClick={() => setAlternateLanguageDialogOpen(true)}
                          variant="outline" 
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Language
                        </Button>
                      </div>
                      
                      {Object.keys(seoData.alternateLanguages).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No alternate languages configured
                        </div>
                      ) : (
                        <div className="space-y-3 mt-4">
                          {Object.entries(seoData.alternateLanguages).map(([code, url]) => (
                            <div key={code} className="flex items-center justify-between p-3 border rounded-md">
                              <div>
                                <div className="font-medium">{code}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-xs">{url}</div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeAlternateLanguage(code)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm bg-gray-50 p-3 rounded-md mt-4">
                        <p className="font-medium mb-1">Tips:</p>
                        <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                          <li>Use ISO language codes (e.g., &quot;en&quot; for English, &quot;es&quot; for Spanish)</li>
                          <li>Include region codes for regional variants (e.g., &quot;en-US&quot;, &quot;es-ES&quot;)</li>
                          <li>Use &quot;x-default&quot; for the default language version</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advice</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Multilingual SEO:</h3>
                        <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                          <li>Use unique, translated content for each language</li>
                          <li>Implement hreflang tags for all language versions</li>
                          <li>Create separate URLs for each language version</li>
                          <li>Maintain consistent URL structure across languages</li>
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Theme Color Usage:</h3>
                        <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                          <li>Choose a color that matches your brand</li>
                          <li>Visible when users pin your site on mobile</li>
                          <li>Consider using a slightly darker version of your primary brand color</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Structured Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Structured Data</CardTitle>
                      <CardDescription>
                        JSON-LD markup for rich search results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-md overflow-x-auto text-sm font-mono">
                          <pre className="whitespace-pre-wrap">
                            {seoData.jsonLd}
                          </pre>
                        </div>
                        <Button onClick={openJsonLdDialog} variant="outline" size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          Edit JSON-LD
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Robots.txt */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Robots.txt</CardTitle>
                      <CardDescription>
                        Control how search engines access your site
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-md overflow-x-auto">
                          <pre className="text-sm font-mono whitespace-pre-wrap">
                            {seoData.robotsTxt || "# No robots.txt content set"}
                          </pre>
                        </div>
                        <Button onClick={openRobotsDialog} variant="outline" size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          Edit robots.txt
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">This file tells search crawlers which parts of your site they can access. Changes will apply after saving.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-xs text-muted-foreground">
                          Located at {seoData.canonicalUrl}/robots.txt
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sitemap Settings */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sitemap</CardTitle>
                      <CardDescription>
                        Help search engines discover your content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {seoData.sitemapStatus === 'active' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span>Status: <Badge variant={seoData.sitemapStatus === 'active' ? "default" : "secondary"}>
                            {seoData.sitemapStatus}
                          </Badge></span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateSitemap}
                          disabled={isGeneratingSitemap}
                        >
                          {isGeneratingSitemap ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Regenerate
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-1">
                        <Label>Last Generated</Label>
                        <p className="text-sm">
                          {seoData.sitemapLastGenerated 
                            ? new Date(seoData.sitemapLastGenerated).toLocaleString() 
                            : "Never generated"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label>Sitemap Configuration</Label>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="sitemap-frequency" className="text-sm">Change Frequency</Label>
                            <Select 
                              value={seoData.sitemapFrequency} 
                              onValueChange={(value) => handleSelectChange('sitemapFrequency', value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent className='bg-white'>
                                <SelectItem value="always">Always</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <Label htmlFor="sitemap-priority" className="text-sm">Default Priority</Label>
                            <Select 
                              value={seoData.sitemapPriority} 
                              onValueChange={(value) => handleSelectChange('sitemapPriority', value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent className='bg-white'>
                                <SelectItem value="0.1">0.1</SelectItem>
                                <SelectItem value="0.3">0.3</SelectItem>
                                <SelectItem value="0.5">0.5</SelectItem>
                                <SelectItem value="0.7">0.7</SelectItem>
                                <SelectItem value="0.8">0.8</SelectItem>
                                <SelectItem value="1.0">1.0</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label>Sitemap URL</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={`${seoData.canonicalUrl}/sitemap.xml`}
                            readOnly
                            className="text-sm font-mono"
                          />
                          <Button variant="outline" size="icon" title="Copy URL">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c0-1.1.9-2 2-2h2"/><path d="M4 12c0-1.1.9-2 2-2h2"/><path d="M4 8c0-1.1.9-2 2-2h2"/></svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Ping Search Engines</span>
                        <Button variant="outline" size="sm">
                          Submit Sitemap
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span>Cache Cleanup</span>
                        <Button variant="outline" size="sm">
                          Clear Cache
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span>Metadata Audit</span>
                        <Button variant="outline" size="sm">
                          Run Audit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Robots.txt Edit Dialog */}
      <Dialog open={robotsDialogOpen} onOpenChange={setRobotsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit robots.txt</DialogTitle>
            <DialogDescription>
              Specify which pages search engines are allowed to crawl and index
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={tempRobotsTxt}
                onChange={(e) => setTempRobotsTxt(e.target.value)}
                className="font-mono h-64"
                placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${seoData.canonicalUrl}/sitemap.xml`}
              />
            </div>
            <div className="text-sm">
              <h4 className="font-medium">Common directives:</h4>
              <ul className="list-disc ml-5 mt-2 text-muted-foreground space-y-1">
                <li><code>User-agent: *</code> - Applies to all crawlers</li>
                <li><code>Allow: /</code> - Allow crawling of specified directory</li>
                <li><code>Disallow: /private/</code> - Prevent crawling of specified directory</li>
                <li><code>Sitemap: https://domain.com/sitemap.xml</code> - Sitemap location</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button className='bg-gray-200 cursor-pointer' variant="ghost" onClick={() => setRobotsDialogOpen(false)}>Cancel</Button>
            <Button className='bg-gray-200 cursor-pointer' onClick={saveRobotsTxt}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* JSON-LD Edit Dialog */}
      <Dialog open={jsonLdDialogOpen} onOpenChange={setJsonLdDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit JSON-LD Structured Data</DialogTitle>
            <DialogDescription>
              Add structured data to help search engines understand your content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>JSON-LD Content</Label>
              <Textarea
                value={tempJsonLd}
                onChange={(e) => setTempJsonLd(e.target.value)}
                className="font-mono h-64"
              />
            </div>
            <div className="text-sm">
              <h4 className="font-medium">Common structured data types:</h4>
              <ul className="list-disc ml-5 mt-2 text-muted-foreground space-y-1">
                <li>Organization - Company information and social media profiles</li>
                <li>Product - For product pages including price, availability, and reviews</li>
                <li>Article - For blog posts with author and publication date</li>
                <li>LocalBusiness - For businesses with physical locations</li>
                <li>FAQPage - For FAQ sections to appear in search results</li>
              </ul>
              <p className="mt-2">
                <a 
                  href="https://schema.org" 
                  target="_blank" 
                  rel="noopener" 
                  className="text-blue-600 hover:underline"
                >
                  Learn more about Schema.org
                </a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button className='bg-gray-200 cursor-pointer' variant="ghost" onClick={() => setJsonLdDialogOpen(false)}>Cancel</Button>
            <Button className='bg-gray-200 cursor-pointer' onClick={saveJsonLd}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alternate Language Dialog */}
      <Dialog open={alternateLanguageDialogOpen} onOpenChange={setAlternateLanguageDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Add Language Variant</DialogTitle>
            <DialogDescription>
              Specify language code and URL for an alternate language version
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="language-code">Language Code</Label>
              <Input
                id="language-code"
                value={tempLanguageCode}
                onChange={(e) => setTempLanguageCode(e.target.value)}
                placeholder="e.g., fr, en-GB, x-default"
              />
              <p className="text-xs text-muted-foreground">
                ISO language code, optionally with region (e.g., &quot;es&quot;, &quot;en-US&quot;)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-url">URL</Label>
              <Input
                id="language-url"
                value={tempLanguageUrl}
                onChange={(e) => setTempLanguageUrl(e.target.value)}
                placeholder="https://example.com/fr/"
              />
              <p className="text-xs text-muted-foreground">
                Full URL for this language version
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button className='bg-gray-200 cursor-pointer' variant="ghost" onClick={() => setAlternateLanguageDialogOpen(false)}>Cancel</Button>
            <Button className='bg-gray-200 cursor-pointer' onClick={addAlternateLanguage}>Add Language</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}