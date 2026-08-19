<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'last_seen_forum_at',
        'identity_type',
        'identity_number',
        'identity_photo',
        'verification_status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_seen_forum_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relasi One To One
    |--------------------------------------------------------------------------
    */

    public function balance()
    {
        return $this->hasOne(Balance::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Relasi One To Many
    |--------------------------------------------------------------------------
    */

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    public function forumMessages()
    {
        return $this->hasMany(ForumMessage::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Many To Many : User <-> Branch
    |--------------------------------------------------------------------------
    */

    public function branches()
    {
        return $this->belongsToMany(
            Branch::class,
            'branch_user',
            'user_id',
            'branch_id'
        )->withTimestamps();
    }
}