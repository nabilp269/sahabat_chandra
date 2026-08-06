<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('identity_type')->nullable();

            $table->string('identity_number')->nullable();

            $table->string('identity_photo')->nullable();

            $table->enum('verification_status', [
                'pending',
                'approved',
                'rejected'
            ])->default('pending');

        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([
                'identity_type',
                'identity_number',
                'identity_photo',
                'verification_status',
            ]);

        });
    }
};