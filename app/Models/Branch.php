<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $table = 'branches';

    protected $fillable = [
        'name',
        'address',
        'phone',

        // Koordinat
        'latitude',
        'longitude',

        // Link Google Maps
        'google_maps_url',

        // Jam Operasional
        'open_time',
        'close_time',
    ];

    protected $casts = [
        'latitude' => 'double',
        'longitude' => 'double',
    ];

    protected $appends = [
        'operational_hours',
        'coordinates',
    ];

    /*
    |--------------------------------------------------------------------------
    | Jam Operasional
    |--------------------------------------------------------------------------
    */

    public function getOperationalHoursAttribute()
    {
        return "{$this->open_time} - {$this->close_time}";
    }

    /*
    |--------------------------------------------------------------------------
    | Koordinat
    |--------------------------------------------------------------------------
    */

    public function getCoordinatesAttribute()
    {
        return [
            'lat' => $this->latitude,
            'lng' => $this->longitude,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Many To Many
    |--------------------------------------------------------------------------
    */

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'branch_user',
            'branch_id',
            'user_id'
        )->withTimestamps();
    }
}