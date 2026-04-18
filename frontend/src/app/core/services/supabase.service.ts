import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase.config';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase!: SupabaseClient;
    private platformId = inject(PLATFORM_ID);
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // Signal to track if Supabase has finished its initial session check
    isAuthReady = signal<boolean>(false);
    private authReadyPromise!: Promise<void>;
    private resolveAuthReady!: () => void;

    constructor() {
        const isBrowser = isPlatformBrowser(this.platformId);

        // Create the promise FIRST, BEFORE any try/catch, so it is always available
        this.authReadyPromise = new Promise<void>((resolve) => {
            this.resolveAuthReady = resolve;
        });

        // Safety: always resolve after 3 seconds in case Supabase never fires
        const timeout = setTimeout(() => {
            if (!this.isAuthReady()) {
                console.warn('Supabase auth timed out — proceeding anyway.');
                this.isAuthReady.set(true);
                this.resolveAuthReady();
            }
        }, 3000);

        try {
            this.supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
                auth: {
                    persistSession: isBrowser,
                    autoRefreshToken: isBrowser,
                    detectSessionInUrl: isBrowser,
                    // Uses Supabase default storage key (matches what was saved on login)
                }
            });

            if (isBrowser) {
                // onAuthStateChange fires INITIAL_SESSION once Supabase reads from localStorage
                this.supabase.auth.onAuthStateChange((event) => {
                    if (!this.isAuthReady()) {
                        if (timeout) clearTimeout(timeout);
                        this.isAuthReady.set(true);
                        this.resolveAuthReady();
                    }
                });
            } else {
                // Server side: auth is always "ready" (empty)
                if (timeout) clearTimeout(timeout);
                this.isAuthReady.set(true);
                this.resolveAuthReady();
            }
        } catch (err) {
            console.error('Failed to initialize Supabase client:', err);
            if (timeout) clearTimeout(timeout);
            this.supabase = {} as any;
            // Resolve anyway so guards don't hang forever
            if (!this.isAuthReady()) {
                this.isAuthReady.set(true);
                this.resolveAuthReady();
            }
        }
    }

    get client() {
        return this.supabase;
    }

    /**
     * Waits for Supabase to finish its internal session check from local storage.
     * Prevents race conditions where guards check auth before it's loaded.
     */
    async waitForAuth(): Promise<void> {
        return this.authReadyPromise;
    }

    // Auth
    async signIn(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    async signOut() {
        return await this.supabase.auth.signOut();
    }

    async getSession() {
        return await this.supabase.auth.getSession();
    }

    async getUser() {
        const { data: { user } } = await this.supabase.auth.getUser();
        return user;
    }

    // Storage
    async uploadFile(bucket: string, path: string, file: File) {
        return await this.supabase.storage.from(bucket).upload(path, file);
    }

    async getPublicUrl(bucket: string, path: string) {
        return this.supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    }

    getTransformedUrl(url: string, options: { width?: number, height?: number, quality?: number, format?: 'webp' | 'avif' | 'origin' } = {}) {
        if (!url || !url.includes('supabase.co/storage/v1/object/public/')) return url;

        const params = new URLSearchParams();
        if (options.width) params.append('width', options.width.toString());
        if (options.height) params.append('height', options.height.toString());
        params.append('quality', (options.quality || 80).toString());
        if (options.format) params.append('format', options.format);

        return `${url}?${params.toString()}`;
    }

    async deleteFile(bucket: string, path: string) {
        return await this.supabase.storage.from(bucket).remove([path]);
    }

    // Database
    async getGallery() {
        return await this.supabase.from('gallery').select('*').order('created_at', { ascending: false });
    }

    async getGalleryPaginated(page: number = 1, pageSize: number = 10) {
        return await this.supabase
            .from('gallery')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range((page - 1) * pageSize, page * pageSize - 1);
    }

    async addToGallery(item: { url: string, type: 'image' | 'video', title?: string }) {
        return await this.supabase.from('gallery').insert([item]);
    }

    async removeFromGallery(id: number) {
        return await this.supabase.from('gallery').delete().eq('id', id);
    }

    async getPromotionalVideo() {
        return await this.supabase.from('settings').select('value').eq('key', 'promo_video_url').single();
    }

    async updatePromotionalVideo(url: string) {
        return await this.supabase.from('settings').upsert({ key: 'promo_video_url', value: url });
    }

    // Team
    async getTeam() {
        return await this.supabase.from('team').select('*').order('display_order', { ascending: true });
    }

    async addTeamMember(member: any) {
        return await this.supabase.from('team').insert([member]);
    }

    async updateTeamMember(id: string, member: any) {
        return await this.supabase.from('team').update(member).eq('id', id);
    }

    async deleteTeamMember(id: string) {
        return await this.supabase.from('team').delete().eq('id', id);
    }

    // Repertoire
    async getRepertoire(page: number = 1, pageSize: number = 100, query: string = '') {
        let dbQuery = this.supabase
            .from('repertoire')
            .select('*', { count: 'exact' })
            .order('display_order', { ascending: true })
            .range((page - 1) * pageSize, page * pageSize - 1);

        if (query) {
            dbQuery = dbQuery.or(`title.ilike.%${query}%,artist.ilike.%${query}%`);
        }

        return await dbQuery;
    }

    async addRepertoireItem(item: any) {
        return await this.supabase.from('repertoire').insert([item]);
    }

    async updateRepertoireItem(id: number, item: any) {
        return await this.supabase.from('repertoire').update(item).eq('id', id);
    }

    async deleteRepertoireItem(id: number) {
        return await this.supabase.from('repertoire').delete().eq('id', id);
    }

    // Testimonials
    async getTestimonials() {
        return await this.supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    }

    async addTestimonial(item: any) {
        return await this.supabase.from('testimonials').insert([item]);
    }

    async updateTestimonial(id: number, item: any) {
        return await this.supabase.from('testimonials').update(item).eq('id', id);
    }

    async deleteTestimonial(id: number) {
        return await this.supabase.from('testimonials').delete().eq('id', id);
    }

    // Packs
    async getPacks() {
        return await this.supabase.from('packs').select('*').order('display_order', { ascending: true });
    }

    async updatePack(id: string, item: any) {
        return await this.supabase.from('packs').update(item).eq('id', id);
    }

    async getBookedDates() {
        const { data, error } = await this.supabase
            .from('bookings')
            .select('date, status');

        if (error) throw error;
        return data || [];
    }

    // Bookings Management
    async getAllBookings() {
        return await this.supabase
            .from('bookings')
            .select('*')
            .order('date', { ascending: false });
    }

    async updateBooking(id: string, updates: any) {
        return await this.supabase
            .from('bookings')
            .update(updates)
            .eq('id', id)
            .select();
    }

    async deleteBooking(id: string) {
        console.log('Attempting to delete booking with ID:', id);
        return await this.supabase
            .from('bookings')
            .delete()
            .eq('id', id)
            .select();
    }

    async addBooking(booking: any) {
        return await this.supabase
            .from('bookings')
            .insert([booking]);
    }

    // API methods
    async getSongsCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.http.get<{ count: number }>(`${this.apiUrl}/songs/count`).subscribe({
                next: (res) => resolve(res.count),
                error: (err) => reject(err)
            });
        });
    }

    async getTestimonialsApi(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get<any[]>(`${this.apiUrl}/testimonials`).subscribe({
                next: (res) => resolve(res),
                error: (err) => reject(err)
            });
        });
    }
}
