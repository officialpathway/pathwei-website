// src/app/admin/settings/seo/page.tsx
"use client";

import AdminLayout from '../layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

type SEOData = {
  title: string;
  description: string;
  keywords: string;
  allowIndexing: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterImage: string;
  sitemapLastGenerated: string;
  sitemapStatus: string;
  robotsTxt: string;
};

export default function SEOSettings() {
  const [seoData, setSeoData] = useState<SEOData>({
    title: "AI Haven Labs | AI-Powered Productivity Suite",
    description: "Building AI tools to enhance human potential through technology",
    keywords: "AI, productivity, tools, technology",
    allowIndexing: true,
    ogTitle: "AI Haven Labs",
    ogDescription: "Next-generation AI tools for personal and professional growth",
    ogImage: "https://aihavenlabs.com/og-image.jpg",
    twitterCard: "summary_large_image",
    twitterImage: "https://aihavenlabs.com/twitter-image.jpg",
    sitemapLastGenerated: "2023-11-20T10:30:00Z",
    sitemapStatus: "active",
    robotsTxt: `User-agent: *
Allow: /
Sitemap: https://aihavenlabs.com/sitemap.xml`
  });

  const [isGeneratingSitemap, setIsGeneratingSitemap] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoData((prev: SEOData) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setSeoData((prev: SEOData) => ({ ...prev, [name]: value }));
  };

  const generateSitemap = async () => {
    setIsGeneratingSitemap(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSeoData((prev: SEOData) => ({
        ...prev,
        sitemapLastGenerated: new Date().toISOString(),
        sitemapStatus: "active"
      }));
    } finally {
      setIsGeneratingSitemap(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">SEO Configuration</h2>
          <Button>Save Changes</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main SEO Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Meta Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">Title Template</Label>
                  <Input
                    id="seo-title"
                    name="title"
                    value={seoData.title}
                    onChange={handleInputChange}
                    placeholder="%s | Site Name"
                  />
                  <p className="text-sm text-muted-foreground">
                    The template used for page titles. Use %s for dynamic page titles.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    name="description"
                    value={seoData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-keywords">Keywords</Label>
                  <Input
                    id="seo-keywords"
                    name="keywords"
                    value={seoData.keywords}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Comma-separated list of keywords (e.g., &quot;AI, tools, productivity&quot;)
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

            {/* Social Media Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="og-title">OpenGraph Title</Label>
                    <Input
                      id="og-title"
                      name="ogTitle"
                      value={seoData.ogTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="og-description">OpenGraph Description</Label>
                    <Input
                      id="og-description"
                      name="ogDescription"
                      value={seoData.ogDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og-image">OpenGraph Image URL</Label>
                  <Input
                    id="og-image"
                    name="ogImage"
                    value={seoData.ogImage}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Twitter Card Type</Label>
                    <select
                      title='Twitter card type'
                      value={seoData.twitterCard}
                      onChange={(e) => setSeoData(prev => ({ ...prev, twitterCard: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter-image">Twitter Image URL</Label>
                    <Input
                      id="twitter-image"
                      name="twitterImage"
                      value={seoData.twitterImage}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sitemap & Robots */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {seoData.sitemapStatus === 'active' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span>Status: <Badge variant={seoData.sitemapStatus === 'active' ? 'default' : 'secondary'}>
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
                    {new Date(seoData.sitemapLastGenerated).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label>View Sitemap</Label>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    https://aihavenlabs.com/sitemap.xml
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Robots.txt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Current Configuration</Label>
                  <pre className="p-4 rounded-md bg-muted text-sm overflow-x-auto">
                    {seoData.robotsTxt}
                  </pre>
                  <Button variant="outline" size="sm">
                    Edit robots.txt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}