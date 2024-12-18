<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create();

        $bakhoorBurnerCategoryId = Category::create([
            'name' => 'Bakhoor Burner Set',
            'description' => 'A variety of Bakhoor burners, charcoal, and premium imported lighters.',
            'status' => false,
        ]);

        $accessoriesCategoryId = Category::create([
            'name' => 'Accessories',
            'description' => 'Premium quality accessories including charcoal, lighters, and gas cylinders.',
            'status' => false,
        ]);

        // Product::create([
        //     'category_id' => $bakhoorBurnerCategoryId->id,
        //     'name' => 'ক্যালিগ্রাফি বাখুর বার্নার/Calligraphy Bakhoor Burner ৮”',
        //     'description' => 'আমাদের প্যাকেজে যা যা পাবেন 👇🏻 
        //     ✅ ১ টি ক্যালিগ্রাফি বাখুর বার্নার/দানি 
        //     ✅ ১  টি প্রিমিয়াম জেট লাইটার
        //     ✅ ১ প্যাকেট কয়লা (১০ পিস)
        //     ✅ ৩টি ভিন্ন ফ্লেভারের বাখুর
        //     মামুল বাখুর
        //     কেক বাখুর
        //     লোবান হুজারি বাখুর
        //     ✅ কয়লা জ্বালাতে ০৫ টি ফয়েল পেপার  
        //     ✅ বোনাস/ডিস্কাউন্ট কার্ড 
            
            
        //     বিঃদ্রঃ- আপনি আপনার পছন্দ মত যে কোনো ডিজাইনের বার্নার ও চাহিদা মত বাখুর,লাইটার ও কয়লা কাস্টমাইজ করে নিতে পারবেন।  
            
        //     আমাদের কাছে পাবেন বিভিন্ন ফ্লেবারের বাখুর ও বিভিন্ন ডিজাইনের প্রিমিয়াম ইম্পোটেড লাইটার।
            
        //     রংঃ- হোয়াইট গোল্ডেন ও ব্ল্যাক গোল্ডেন
        //     বডি/গঠন/মেটেরিয়ালঃ- সিরামিক ও এস এস স্টিল ।

        //     বাখুর কি ?
        //     উঃ  বাখুর হলো একটি ঐতিহ্যবাহী সুগন্ধিত ধূপ/কাঠ। যা প্রাচীন,সংস্কৃতি এবং বিশ্বের সকল সম্প্রদায়ে ব্যবহৃত হয়।


        //     বাখুরের ঘ্রাণ কেমনঃ- 
        //     বাখুর এর সুগন্ধির সুবাস আপনার চারপাশকে গরে তোলে স্নিগ্ধ  সুগন্ধময় ,শান্তিপূর্ণ ও মনোমোগ্ধকর এক পরিবেশ। এই বাখুরের সুবাসকে বলা যায় শুদ্ধ,হালকা কড়া, মিষ্টি ও মসৃণ, (যা স্নিফ করার পর আপনি এর ঘ্রাণে মুগ্ধ হয়ে চোখ বন্ধ করে হারিয়ে যেতে পারেন কল্পনার কোন এক পবিত্র জগতে।/যা আপনাকে নিয়ে যাবে মরুভূমির এক অপার্থিব জগতে।)। বাখুরের সু-ঘ্রাণ এর  স্থায়ীত্ব  লং-লাস্টিং। 
            
        //     ঘ্রাণ কতক্ষন থাকবেঃ- 
        //     এটি সাধারণ এয়ারফ্রেশ্নার মতো নয়, এটি ব্যবহারের ফলে দীর্ঘক্ষণ পর্যন্ত ঘর সুবাসিত হয়ে থাকবে। আবদ্ধ ঘরে ঘ্রান দীর্ঘস্থায়ী হবে। তবে বাতাস আসা যাওয়ার ব্যাবস্থা থাকলে সেটা বেশিক্ষণ থাকবেনা।


        //     বাখুরের উপকারিতাঃ- 
        //     বাখুর এমন একটি সুগন্ধি যা মানুষের অভ্যন্তরীণ শান্তি প্রচার করে। এটি মানুষের মন এবং মস্তিষ্কে ফ্রেস ও সতেজ রাখতে সহযোগিতা করে। বাখুরে ব্যবহৃত কিছু উপাদান অ্যান্টি-ব্যাকটেরিয়াল এবং অ্যান্টি-ইনফ্লেমেটরি গুণাবলী থাকে যা সাধারণ স্বাস্থ্য এবং সুস্থতার জন্য উপকারী যেমন বাখুর এর ধো’য়া নাক দিয়ে টেনে নিলে শ্বাসনালীর ব্যাথা কমে এবং নিউমোনিয়া দূর করে/হয় ।এছাড়াও যারা অনিদ্রা বা খারাপ ঘুমের সমস্যায় ভুগছেন তাদের জন্য বাখুরের সুগন্ধি অনেকটাই হেল্পফুল। 

        //     কাদের জন্য উপযুক্তঃ- 
        //     যুবক-যুবতী ও বৃদ্ধ-বৃদ্ধা যারা সবসময় সুগন্ধির মধ্যে রাজ/বসাবাস করতে পছন্দ করেন বাখুর বিশেষভাবে তাদের জন্য উপযুক্ত।এটি এমন ব্যক্তিদের জন্য তৈরি যারা ঐতিহ্যবাহী সুগন্ধীময় মোহনীয় সুবাসের মেলবন্ধনকে আধুনিকতার সঙ্গে অনুভব করতে চান।  

        //     কেন পছন্দ হবেঃ- 
        //     যেহেতু আপনি স্নিফ করে নিতে পারছেন না সেহেতু আমরা বিশেষ চাহিদা সম্পন্ন সবার পছন্দনীয় ৩টি প্রিমিয়াম ফ্লেবার এর বাখুর দিবো।আপনারা অবশ্যই এটি পছন্দ করবেন কারণ এর সুবাস একদিকে যেমন শুদ্ধ ও স্নিগ্ধ, তেমনই গভীর ও দীর্ঘস্থায়ী। এটি যে কোনো বিশেষ অনুষ্ঠান বা ব্যক্তিগত মুহূর্তকে আরও স্মরণীয় করে তুলবে, এবং এর মিষ্টি ও শান্তিপূর্ণ সুবাস তাদের হৃদয়ে একটি স্থায়ী ছাপ রেখে যাবে।এবং দেখতে ও সৌন্দর্যে আকর্ষিত করবে।

        //     কতোদিন লাস্টিং করবে?
        //     প্যাকেজ এ ৩ টি ফ্লেবার থেকে ১০ গ্রাম করে ৩ গ্রাম বাখুর দেওয়া হবে। আপনি যদি ১ গ্রাম করে ব্যবহার করেন তাহলে ৩০ বার ব্যাবহার করতে পারবেন। ২ গ্রাম করে বার্ন করলে ১৫ বার। এখন আপনি চাইলে ১দিনেই শেষ করতে পারবেন আবার চাইলে ৩০ দিনে। এটা পুরোটা আপনার ব্যাবহারের উপর নির্ভর করছে।


        //     বার্নারঃ- 
        //     বাখুর ব্যাবহারের জন্য বার্নার প্রয়োজন হয়ে থাকে।এই বার্নারটি চায়না থেকে ইম্পোটেড ১০০% অরজিনাল মেটাল/সিরামিক দ্বারা তৈরী। এর মধ্যে রয়েছে নিখুত কারুকাজ, যা এক অসাধারণ রাজকীয়  সৌন্দর্য ফুটিয়ে তোলা হয়েছে । এটিকে বার্নার ছাড়াও ঘরের সৌন্দর্য বৃদ্ধিতে শো-পিস হিসেবে ব্যবহারের সুযোগ করে দেই।।

        //     ব্যবহার বিধিঃ- 

        //     ১) প্রথমে বাখুর বার্নারের উপর ফয়েল পেপারটি দিবেন।
        //     ২) ফয়েল পেপারটির উপর এক পিস কয়লা বসিয়ে নিবেন।
        //     ৩) জেট লাইটার দ্বারা ভাল করে কয়লাটি জ্বালিয়ে নিবেন।
        //     ৪) জ্বলন্ত কয়লার উপরে আপনার পছন্দ মতো বাখুর পরিমাণ মত দিয়ে নিবেন।
        //     > কিছুক্ষণের মধ্যে বুঝতে পারবেন চারপাশে অসাধারণ সুবাস ছড়াচ্ছে। 
        //     ',
        //     'price' => 2450.00,
        // ]);

        // Product::create([
        //     'category_id' => $bakhoorBurnerCategoryId->id,
        //     'name' => 'কিউট মেটাল বাখুর বার্নার/Cute Metal Bakhur Burner লম্বায় ৫” পাশে ৪.৫” ',
        //     'description' => 'প্যাকেজে যা যা পাবেন 👇🏻 
        //     ✅ ১ টি কিউট মেটাল বাখুর বার্নার/দানি 
        //     ✅ ১  টি প্রিমিয়াম জেট লাইটার
        //     ✅ ১ প্যাকেট কয়লা (১০ পিস)
        //     ✅ ৩টি ভিন্ন ফ্লেভারের বাখুর
        //     মামুল বাখুর
        //     কেক বাখুর
        //     লোবান হুজারি বাখুর
        //     ✅ কয়লা জ্বালাতে ০৫ টি ফয়েল পেপার  
        //     ✅ বোনাস/ডিস্কাউন্ট কার্ড 
        //     বিঃদ্রঃ- আপনি আপনার পছন্দ মত যে কোনো ডিজাইনের বার্নার ও চাহিদা মত বাখুর,লাইটার ও কয়লা কাস্টমাইজ করে নিতে পারবেন।  
        //     আমাদের কাছে পাবেন বিভিন্ন ফ্লেবারের বাখুর ও বিভিন্ন ডিজাইনের প্রিমিয়াম ইম্পোটেড লাইটার।
        //     রংঃ- গোল্ডেন ও সিলভার। 
        //     বডি/গঠন/মেটেরিয়ালঃ- সম্পুর্ণ মেটাল। 
        //     হোয়াটস আপ নাম্বারঃ- 
        //     Description
        //      বাখুর কি ?
        //     উঃ  বাখুর হলো একটি ঐতিহ্যবাহী সুগন্ধিত ধূপ/কাঠ। যা প্রাচীন,সংস্কৃতি এবং বিশ্বের সকল সম্প্রদায়ে ব্যবহৃত হয়।
        //     বাখুরের ঘ্রাণ কেমনঃ- 
        //     বাখুর এর সুগন্ধির সুবাস আপনার চারপাশকে গরে তোলে স্নিগ্ধ  সুগন্ধময় ,শান্তিপূর্ণ ও মনোমোগ্ধকর এক পরিবেশে। এই বাখুরের সুবাসকে বলা যায় শুদ্ধ,হালকা কড়া, মিষ্টি ও মসৃণ, (যা স্নিফ করার পর আপনি এর ঘ্রাণে মুগ্ধ হয়ে চোখ বন্ধ করে হারিয়ে যেতে পারেন কল্পনার কোন এক পবিত্র জগতে।/যা আপনাকে নিয়ে যাবে মরুভূমির এক অপার্থিব জগতে।)। বাখুরের সু-ঘ্রাণ এর  স্থায়ীত্ব  লং-লাস্টিং। 
        //     ঘ্রাণ কতক্ষন থাকবেঃ- 
        //     এটি সাধারণ এয়ারফ্রেশ্নার মতো নয়, এটি ব্যবহারের ফলে দীর্ঘক্ষণ পর্যন্ত ঘর সুবাসিত হয়ে থাকবে। আবদ্ধ ঘরে ঘ্রান দীর্ঘস্থায়ী হবে। তবে বাতাস আসাযাওয়ার ব্যাবস্থা থাকলে সেটা বেশিক্ষণ থাকবেনা।
        //     বাখুরের উপকারিতাঃ- 
        //     বাখুর এমন একটি সুগন্ধি যা মানুষের অভ্যন্তরীণ শান্তি প্রচার করে। এটি মানুষের মন এবং মস্তিষ্কে ফ্রেস ও সতেজ রাখতে সহযোগিতা করে।বাখুরে ব্যবহৃত কিছু উপাদান অ্যান্টি-ব্যাকটেরিয়াল এবং অ্যান্টি-ইনফ্লেমেটরি গুণাবলী থাকে যা সাধারণ স্বাস্থ্য এবং সুস্থতার জন্য উপকারী যেমন বাখুর এর ধো’য়া নাক দিয়ে টেনে নিলে শ্বাসনালীর ব্যাথা কমে এবং নিউমোনিয়া দূর করে/হয় ।এছাড়াও যারা অনিদ্রা বা খারাপ ঘুমের সমস্যায় ভুগছেন তাদের জন্য বাখুরের সুগন্ধি অনেকটাই হেল্পফুল। 
        //     কাদের জন্য উপযুক্তঃ- 
        //      যুবক-যুবতী ও বৃদ্ধ-বৃদ্ধা যারা সবসময় সুগন্ধির মধ্যে রাজ/বসাবাস করতে পছন্দ করেন বাখুর বিশেষভাবে তাদের জন্য উপযুক্ত।এটি এমন ব্যক্তিদের জন্য তৈরি যারা ঐতিহ্যবাহী সুগন্ধীময় মোহনীয় সুবাসের মেলবন্ধনকে আধুনিকতার সঙ্গে অনুভব করতে চান।  
            
        //     কেন পছন্দ হবেঃ- 
        //     যেহেতু আপনি স্নিফ করে নিতে পারছেন না সেহেতু আমরা বিশেষ চাহিদা সম্পন্ন সবার পছন্দনীয় ৩টি প্রিমিয়াম ফ্লেবার এর বাখুর দিবো।আপনারা অবশ্যই এটি পছন্দ করবেন কারণ এর সুবাস একদিকে যেমন শুদ্ধ ও স্নিগ্ধ, তেমনই গভীর ও দীর্ঘস্থায়ী। এটি যে কোনো বিশেষ অনুষ্ঠান বা ব্যক্তিগত মুহূর্তকে আরও স্মরণীয় করে তুলবে, এবং এর মিষ্টি ও শান্তিপূর্ণ সুবাস তাদের হৃদয়ে একটি স্থায়ী ছাপ রেখে যাবে।এবং দেখতে ও সৌন্দর্যে আকর্ষিত করবে।
        //      কতোদিন লাস্টিং করবে?
        //      প্যাকেজ এ ৩ টি ফ্লেবার থেকে ১০ গ্রাম করে ৩ গ্রাম বাখুর দেওয়া হবে। আপনি যদি ১ গ্রাম করে ব্যবহার করেন তাহলে ৩০ বার ব্যাবহার করতে পারবেন। ২ গ্রাম করে বার্ন করলে ১৫ বার। এখন আপনি চাইলে ১দিনেই শেষ করতে পারবেন আবার চাইলে ৩০ দিনে। এটা পুরোটা আপনার ব্যাবহারের উপর নির্ভর করছে।
        //     বার্নারঃ- 
        //     বাখুর ব্যাবহারের জন্য বার্নার প্রয়োজন হয়ে থাকে।এই বার্নারটি চায়না থেকে ইম্পোটেড ১০০% অরজিনাল মেটাল দ্বারা তৈরী। এর মধ্যে রয়েছে নিখুত কারুকাজ, যা এক অসাধারণ রাজকীয়  সৌন্দর্য ফুটিয়ে তোলা হয়েছে । এটিকে বার্নার ছাড়াও ঘরের সৌন্দর্য বৃদ্ধিতে শো-পিস হিসেবে ব্যবহারের সুযোগ করে দেই।। 

        //     ব্যবহার বিধিঃ- 
        //     ১) প্রথমে বাখুর বার্নারের উপর ফয়েল পেপারটি দিবেন।
        //     ২) ফয়েল পেপারটির উপর এক পিস কয়লা বসিয়ে নিবেন।
        //     ৩) জেট লাইটার দ্বারা ভাল করে কয়লাটি জ্বালিয়ে নিবেন।
        //     ৪) জ্বলন্ত কয়লার উপরে আপনার পছন্দ মতো বাখুর পরিমাণ মত দিয়ে নিবেন।
        //     > কিছুক্ষণের মধ্যে বুঝতে পারবেন চারপাশে অসাধারণ সুবাস ছড়াচ্ছে। 
        //     ',
        //     'price' => 1999.00,
        // ]);

        // Product::create([
        //     'category_id' => $accessoriesCategoryId->id,
        //     'name' => 'Hamil Al Musk Charcoal',
        //     'description' => 'গন্ধহীন আইসোকেমিক্যাল কাঠকয়লা থেকে হালকা এবং দীর্ঘস্থায়ী ধোঁয়াশা/ধোঁয়া তৈরি করে। 

        //     একটি ২৫-৩০ মিনিটের মত জ্বলে/জ্বলবে। 
           
        //    এই কয়লাটি পোড়ালে দেওয়াল কালছে হওয়ার চিন্তা নেই।
           
        //    একটি প্রিমিয়াম প্যাকেট এ ১০ পিস কয়লা থাকবে এবং ১ বক্সে ১০ প্যাকেট কয়লা থাকে। 
        //    ',
        //     'price' => 0.00,  // Specify actual price if needed
        //     'variants' => json_encode([
        //         'সাইজ' => '33 মিমি ব্যাসের চারকোল/কয়লা ডিস্ক',
        //         'পরিমাণ' => '১প্যাকেটে ১০ পিস কয়লা.১ বক্সে ১০ প্যাকেট কয়লা।',
        //     ]),
        // ]);

        // Product::create([
        //     'category_id' => $accessoriesCategoryId->id,
        //     'name' => 'প্রিমিয়াম ইম্পোটেড লাইটার',
        //     'description' => 'এই লাইটারটি ইম্পোর্টেড এবং সম্পুর্ণ ষ্টীল মেটারিয়াল।
        //     এটি হাত থেকে পরলে নষ্ট হওয়ার সম্ভাবনা নেই।
        //     পানিতে ভিজলে নষ্ঠ হওয়ার সম্ভাবনা নেই।
        //     অতিরিক্ত তাপ প্রবাহের ফলে লিকেজ হয়ে কোনো দুর্ঘটনা হওয়ার সম্ভাবনা নেই।
        //     গ্যাস শেষ হলে আবার গ্যাস রিফিল করার সুবিধা রয়েছে। 
        //     ',
        //     'price' => 0.00,  // Specify actual price if needed
        //     'variants' => json_encode([
        //         'মেটেরিয়াল' => 'সম্পুর্ণ মেটাল',
        //         'রং' => ['গোল্ডেন', 'সিলভার'],
        //         'Features' => [
        //             'Durable, does not break easily',
        //             'Water-resistant',
        //             'No leakage even under heat',
        //             'Refillable with butane gas'
        //         ]
        //     ]),
        // ]);

        // Product::create([
        //     'category_id' => $accessoriesCategoryId->id,
        //     'name' => 'Atish Butane Liquified Gas Cylinder',
        //     'description' => 'দীর্ঘস্থায়ী ও টেকসই।
        //     ব্যবহার ও বহন করা সহজ।
        //     লাইটারের উপরিভাগে স্পষ্টভাবে সংজ্ঞায়িত ডিজাইন ।
        //     রিফিলযোগ্য গ্যাস লাইটার স্ট্যান্ডার্ড বিউটেন লাইটার গ্যাস দিয়ে রিফিল করা যায়। 
        //     লাইটার কর্তৃপক্ষ QC টিম দ্বারা পুঙ্খানুপুঙ্খভাবে গুণমান পরীক্ষা করা হয়েছে।
        //     ',
        //     'price' => 0.00,  // Specify actual price if needed
        //     'variants' => json_encode([
        //         'পরিমাণ' => '২৫০ এম এল',
        //     ]),
        // ]);
    }
}
