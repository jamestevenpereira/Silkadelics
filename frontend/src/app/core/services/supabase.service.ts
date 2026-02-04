import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase.config';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storageKey: 'woodplan-auth-token'
            }
        });
    }

    get client() {
        return this.supabase;
    }

    // Auth
    async signIn(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    async signOut() {
        return await this.supabase.auth.signOut();
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

    async deleteFile(bucket: string, path: string) {
        return await this.supabase.storage.from(bucket).remove([path]);
    }

    // Database
    async getGallery() {
        return await this.supabase.from('gallery').select('*').order('created_at', { ascending: false });
    }

    async getGalleryPaginated(page: number = 1, pageSize: number = 9) {
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
}
