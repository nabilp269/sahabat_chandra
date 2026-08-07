<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Mass Assignable
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'identity_type',
        'identity_number',
        'identity_photo',
        'verification_status',
    ];

    /**
     * Hidden
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Cast
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    /**
     * Saldo User
     */
    public function balance()
    {
        return $this->hasOne(Balance::class);
    }

    /**
     * Transaksi User
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Cabang Favorit User
     */
    public function branches()
    {
        return $this->belongsToMany(
            Branch::class,
            'branch_user'
        )->withTimestamps();
    }

    /**
     * Forum
     */
    public function forumMessages()
    {
        return $this->hasMany(ForumMessage::class);
    }

    /**
     * Diskusi
     */
    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    /**
     * Komentar Diskusi
     */
    public function discussionComments()
    {
        return $this->hasMany(DiscussionComment::class);
    }

    /**
     * Notifikasi
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}