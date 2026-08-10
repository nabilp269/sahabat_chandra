<?php

namespace Database\Seeders;

use App\Models\ForumMessage;
use App\Models\ForumLike;
use App\Models\ForumComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::take(5)->get();

        if ($users->isEmpty()) {
            $this->command->info('No users found. Please seed users first.');
            return;
        }

        // Create sample forum posts
        $posts = ForumMessage::create([
            'user_id' => $users[0]->id,
            'message' => '🎉 Senang menggunakan Sahabat Chandra! Platform ini sangat memudahkan untuk berbisnis.',
            'image' => null,
            'is_admin' => false,
        ]);

        ForumMessage::create([
            'user_id' => $users[1]->id,
            'message' => 'Bagaimana cara mengajukan proposal kerjasama? Ada yang pernah coba?',
            'image' => null,
            'is_admin' => false,
        ]);

        ForumMessage::create([
            'user_id' => $users[2]->id,
            'message' => 'Tips: Selalu update data profil Anda untuk kepercayaan partner yang lebih baik. Saya sudah merasakan manfaatnya! 💪',
            'image' => null,
            'is_admin' => false,
        ]);

        // Add some likes
        ForumLike::create([
            'user_id' => $users[1]->id,
            'forum_message_id' => $posts->id,
        ]);

        ForumLike::create([
            'user_id' => $users[2]->id,
            'forum_message_id' => $posts->id,
        ]);

        // Add some comments
        ForumComment::create([
            'user_id' => $users[1]->id,
            'forum_message_id' => $posts->id,
            'comment' => 'Setuju! Aplikasinya user-friendly banget 👍',
        ]);

        ForumComment::create([
            'user_id' => $users[2]->id,
            'forum_message_id' => $posts->id,
            'comment' => 'Sama, aku juga merasa terbantu dengan fitur-fiturnya',
        ]);

        $this->command->info('Forum seeder completed successfully!');
    }
}
