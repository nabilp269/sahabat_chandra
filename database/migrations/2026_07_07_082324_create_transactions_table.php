<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {

            $table->id();

            // User yang melakukan transaksi
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Cabang (boleh kosong)
            $table->foreignId('branch_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Kode transaksi
            $table->string('transaction_code')->unique();

            // Jenis transaksi
            $table->string('type');

            // Data penerima
            $table->string('receiver_name');
            $table->string('receiver_bank');
            $table->string('receiver_account');

            // Nominal
            $table->decimal('amount', 15, 2);

            // Status transaksi
            $table->enum('status', [
                'pending',
                'success',
                'failed',
            ])->default('pending');

            // Catatan
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};