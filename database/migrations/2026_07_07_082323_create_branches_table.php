<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('address');
            $table->string('phone')->nullable();

            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);

            $table->time('open_time');
            $table->time('close_time');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};