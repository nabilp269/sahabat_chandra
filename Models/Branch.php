<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'latitude',
        'longitude',
        'open_time',
        'close_time',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}