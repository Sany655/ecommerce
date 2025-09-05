<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->text('status')->change();
            $table->softDeletes();
        });
        DB::table('orders')
        ->where('status', 'completed')
    ->update(['status' => 'delivered']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled','hold'])->default('pending')->change();
            $table->dropSoftDeletes();
        });
    }
};
