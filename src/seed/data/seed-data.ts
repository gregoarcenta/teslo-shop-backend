import { Gender, Size, Type } from '../../products/enums';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../config';

interface SeedData {
  users: Omit<User, 'id' | 'isActive' | 'products'>[];
  products: CreateProductDto[];
}

export const initialData: SeedData = {
  users: [
    {
      fullName: 'Administrador',
      email: 'admin@admin.com',
      password: 'Admin123',
      roles: [Role.ADMIN],
    },
    {
      fullName: 'Test User',
      email: 'user@google.com',
      password: 'User123',
      roles: [Role.USER],
    },
  ],
  products: [
    {
      description:
        'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.',
      images: ['ql5rsw3bnebyjp8sun3r.jpg', 'evjw10lt3xnszvo2ar4z.jpg'],
      stock: 7,
      price: 75,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'mens_chill_crew_neck_sweatshirt',
      type: Type.SHIRTS,
      tags: ['sweatshirt'],
      title: 'Men’s Chill Crew Neck Sweatshirt',
      gender: Gender.MEN,
    },
    {
      description:
        "The Men's Quilted Shirt Jacket features a uniquely fit, quilted design for warmth and mobility in cold weather seasons. With an overall street-smart aesthetic, the jacket features subtle silicone injected Tesla logos below the back collar and on the right sleeve, as well as custom matte metal zipper pulls. Made from 87% nylon and 13% polyurethane.",
      images: ['xcw7s3w9fmai1anrcdwf.jpg', 'ii0ye9u0elcuohv6lhuq.jpg'],
      stock: 5,
      price: 200,
      sizes: [Size.XS, Size.S, Size.M, Size.XL, Size.XXL],
      slug: 'men_quilted_shirt_jacket',
      type: Type.SHIRTS,
      tags: ['jacket'],
      title: "Men's Quilted Shirt Jacket",
      gender: Gender.MEN,
    },
    {
      description:
        "Introducing the Tesla Raven Collection. The Men's Raven Lightweight Zip Up Bomber has a premium, modern silhouette made from a sustainable bamboo cotton blend for versatility in any season. The hoodie features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, a concealed chest pocket with custom matte zipper pulls and a french terry interior. Made from 70% bamboo and 30% cotton.",
      images: ['slgkaokfwhclfm1nkgqb.jpg', 'cfzyv2ych227ylyeik55.jpg'],
      stock: 10,
      price: 130,
      sizes: [Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'men_raven_lightweight_zip_up_bomber_jacket',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Raven Lightweight Zip Up Bomber Jacket",
      gender: Gender.MEN,
    },
    {
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Men's Turbine Long Sleeve Tee features a subtle, water-based T logo on the left chest and our Tesla wordmark below the back collar. The lightweight material is double-dyed, creating a soft, casual style for ideal wear in any season. Made from 50% cotton and 50% polyester.",
      images: ['g4vtixxu4a0slzokntjm.jpg', 'ls6tpmiwzmzqf5rbp0wp.jpg'],
      stock: 50,
      price: 45,
      sizes: [Size.XS, Size.S, Size.M, Size.L],
      slug: 'men_turbine_long_sleeve_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Turbine Long Sleeve Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Men's Turbine Short Sleeve Tee features a subtle, water-based Tesla wordmark across the chest and our T logo below the back collar. The lightweight material is double-dyed, creating a soft, casual style for ideal wear in any season. Made from 50% cotton and 50% polyester.",
      images: ['s6xa6iiwa7pew6rpymbq.jpg', 'rbdytanmlswsynecpqbh.jpg'],
      stock: 50,
      price: 40,
      sizes: [Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'men_turbine_short_sleeve_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Turbine Short Sleeve Tee",
      gender: Gender.MEN,
    },
    {
      description:
        'Designed for comfort, the Cybertruck Owl Tee is made from 100% cotton and features our signature Cybertruck icon on the back.',
      images: ['jhrgh2z0wuscq5g9ibrn.jpg', 'nbfzdsk4irzqhnwws4ax.jpg'],
      stock: 0,
      price: 35,
      sizes: [Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'men_cybertruck_owl_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Cybertruck Owl Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Inspired by our fully integrated home solar and storage system, the Tesla Solar Roof Tee advocates for clean, sustainable energy wherever you go. Designed for fit, comfort and style, the tee features an aerial view of our seamless Solar Roof design on the front with our signature T logo above 'Solar Roof' on the back. Made from 100% Peruvian cotton.",
      images: ['stpdx61ys7qjlzvx2ivr.jpg', 'm5hj69o9phnr8i4gtiiy.jpg'],
      stock: 15,
      price: 35,
      sizes: [Size.S, Size.M, Size.L, Size.XL],
      slug: 'men_solar_roof_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Solar Roof Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Inspired by the world’s most unlimited resource, the Let the Sun Shine Tee highlights our fully integrated home solar and storage system. Designed for fit, comfort and style, the tee features a sunset graphic along with our Tesla wordmark on the front and our signature T logo printed above 'Solar Roof' on the back. Made from 100% Peruvian cotton.",
      images: ['edmxaxsgj5zdtydh650i.jpg', 'sqq02mlvi0rtktntujtp.jpg'],
      stock: 17,
      price: 35,
      sizes: [Size.XS, Size.S, Size.XL, Size.XXL],
      slug: 'men_let_the_sun_shine_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Let the Sun Shine Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Designed for fit, comfort and style, the Men's 3D Large Wordmark Tee is made from 100% Peruvian cotton with a 3D silicone-printed Tesla wordmark printed across the chest.",
      images: ['qrbbmrd7dohnghmlpys9.jpg', 'dtbrf04unj3jqn0tbpqc.jpg'],
      stock: 12,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'men_3d_large_wordmark_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's 3D Large Wordmark Tee",
      gender: Gender.MEN,
    },
    {
      description:
        'Designed for fit, comfort and style, the Tesla T Logo Tee is made from 100% Peruvian cotton and features a silicone-printed T Logo on the left chest.',
      images: ['xuusu8rydjbjccajc0pj.jpg', 'jimzm0a4ov6f06mvwgoa.jpg'],
      stock: 5,
      price: 35,
      sizes: [Size.XS, Size.S],
      slug: 'men_3d_t_logo_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's 3D T Logo Tee",
      gender: Gender.MEN,
    },
    {
      description:
        'Designed for comfort and style in any size, the Tesla Small Wordmark Tee is made from 100% Peruvian cotton and features a 3D silicone-printed wordmark on the left chest.',
      images: ['kptuuxqwxke7j1am7ye4.jpg', 'tuolt6bu4kxnqjoxdty7.jpg'],
      stock: 2,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'men_3d_small_wordmark_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Men’s 3D Small Wordmark Tee',
      gender: Gender.MEN,
    },
    {
      description:
        "Designed to celebrate Tesla's incredible performance mode, the Plaid Mode Tee features great fit, comfort and style. Made from 100% cotton, it's the next best thing to riding shotgun at the Nürburgring.",
      images: ['caymuimfu8u7a9scettm.jpg', 'x6wlbxzkbu1dgviesnta.jpg'],
      stock: 82,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'men_plaid_mode_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Plaid Mode Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Inspired by our popular home battery, the Tesla Powerwall Tee is made from 100% cotton and features the phrase 'Pure Energy' under our signature logo in the back. Designed for fit, comfort and style, the exclusive tee promotes sustainable energy in any environment.",
      images: ['m08irb9crjfvpzeajcj6.jpg', 'sgnnqirw3gdof1l9vri8.jpg'],
      stock: 24,
      price: 35,
      sizes: [Size.XL, Size.XXL],
      slug: 'men_powerwall_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Powerwall Tee",
      gender: Gender.MEN,
    },
    {
      description:
        'Inspired by Tesla Battery Day and featuring the unveiled tabless battery cell, Battery Day Tee celebrates the future of energy storage and cell manufacturing. Designed for fit, comfort and style, Battery Day Tee is made from 100% cotton with a stylized cell printed across the chest. Made in Peru.',
      images: ['iwilapbk8iipfrjvcpe6.jpg', 'h3diqni3hku0zly0crzc.jpg'],
      stock: 5,
      price: 30,
      sizes: [Size.XS, Size.S, Size.XXL],
      slug: 'men_battery_day_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Battery Day Tee",
      gender: Gender.MEN,
    },
    {
      description:
        'Designed for exceptional comfort and inspired by the Cybertruck unveil event, the Cybertruck Bulletproof Tee is made from 100% cotton and features our signature Cybertruck icon on the back.',
      images: ['k5hrpenr5sk0v3lk6p5s.jpg', 'sygfeaheuyfjfznglryy.jpg'],
      stock: 150,
      price: 30,
      sizes: [Size.M, Size.L],
      slug: 'men_cybertruck_bulletproof_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Men’s Cybertruck Bulletproof Tee',
      gender: Gender.MEN,
    },
    {
      description:
        'Inspired by the Model Y order confirmation graphic, the limited edition Haha Yes Tee is designed for comfort and style. Made from 100% Peruvian cotton and featuring the Tesla wordmark across the chest, the exclusive tee will commemorate your order for years to come.',
      images: ['pp7chx6hp1aftccuzfrk.jpg', 'wvrtie9fowo2ziempmy4.jpg'],
      stock: 10,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'men_haha_yes_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Haha Yes Tee",
      gender: Gender.MEN,
    },
    {
      description:
        'Designed for fit, comfort and style, the limited edition S3XY Tee is made from 100% cotton with a 3D silicone-printed “S3XY” logo across the chest. Made in Peru. Available in black.',
      images: ['l2rircfupcndjx4jnr6r.jpg', 'vfs1zego7i9s8n96x1cw.jpg'],
      stock: 34,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M, Size.L],
      slug: 'men_s3xy_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's S3XY Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Designed for fit, comfort and style, the Men's 3D Wordmark Long Sleeve Tee is made from 100% cotton and features an understated wordmark logo on the left chest.",
      images: ['ngblxebozstd6x3rrrci.jpg', 'xceinpdzirjishdr2evi.jpg'],
      stock: 15,
      price: 40,
      sizes: [Size.XL, Size.XXL],
      slug: 'men_3d_wordmark_long_sleeve_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's 3D Wordmark Long Sleeve Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Designed for fit, comfort and style, the Men's 3D T Logo Long Sleeve Tee is made from 100% cotton and features an understated T logo on the left chest.",
      images: ['eurlhawpyotakmhe6vyt.jpg', 'xhltheyelq8ccuifllnj.jpg'],
      stock: 12,
      price: 40,
      sizes: [Size.XS, Size.XXL],
      slug: 'men_3d_t_logo_long_sleeve_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's 3D T Logo Long Sleeve Tee",
      gender: Gender.MEN,
    },
    {
      description:
        "Introducing the Tesla Raven Collection. The Men's Raven Lightweight Hoodie has a premium, relaxed silhouette made from a sustainable bamboo cotton blend. The hoodie features subtle thermoplastic polyurethane Tesla logos across the chest and on the sleeve with a french terry interior for versatility in any season. Made from 70% bamboo and 30% cotton.",
      images: ['juu2qbdiafjwdd4epdv0.jpg', 'eeqzsttdagmnxjq4kz4g.jpg'],
      stock: 10,
      price: 115,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'men_raven_lightweight_hoodie',
      type: Type.HOODIES,
      tags: ['hoodie'],
      title: "Men's Raven Lightweight Hoodie",
      gender: Gender.MEN,
    },
    {
      description:
        'Introducing the Tesla Chill Collection. The Chill Pullover Hoodie has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The unisex hoodie features subtle thermoplastic polyurethane Tesla logos across the chest and on the sleeve, a double layer single seam hood and pockets with custom matte zipper pulls. Made from 60% cotton and 40% recycled polyester.',
      images: ['yccsuzprxfkbqf6wz4jy.jpg', 'ao951n6zu1za8a8rbtdk.jpg'],
      stock: 10,
      price: 130,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'chill_pullover_hoodie',
      type: Type.HOODIES,
      tags: ['hoodie'],
      title: 'Chill Pullover Hoodie',
      gender: Gender.UNISEX,
    },
    {
      description:
        "Introducing the Tesla Chill Collection. The Men's Chill Full Zip Hoodie has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The hoodie features subtle thermoplastic polyurethane Tesla logos on the left chest and sleeve, a double layer single seam hood and pockets with custom matte zipper pulls. Made from 60% cotton and 40% recycled polyester.",
      images: ['ekwirnmvdg2egqvlwldx.jpg', 'lyvnitudfzcxqakbzods.jpg'],
      stock: 100,
      price: 85,
      sizes: [Size.XS, Size.L, Size.XL, Size.XXL],
      slug: 'men_chill_full_zip_hoodie',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Chill Full Zip Hoodie",
      gender: Gender.MEN,
    },
    {
      description:
        'Introducing the Tesla Chill Collection. The Men’s Chill Quarter Zip Pullover has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The pullover features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, as well as a custom matte zipper pull. Made from 60% cotton and 40% recycled polyester.',
      images: ['tcqevtdme1enh7akfuao.jpg', 'ryieaxo7i9ub7sfkfa6y.jpg'],
      stock: 7,
      price: 85,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'men_chill_quarter_zip_pullover_-_gray',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Chill Quarter Zip Pullover - Gray",
      gender: Gender.MEN,
    },
    {
      description:
        'Introducing the Tesla Chill Collection. The Men’s Chill Quarter Zip Pullover has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The pullover features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, as well as a custom matte zipper pull. Made from 60% cotton and 40% recycled polyester.',
      images: ['mhjn5tmbcvexhervvfiy.jpg', 'liwlagit1kklewbpwelf.jpg'],
      stock: 15,
      price: 85,
      sizes: [Size.XS, Size.S, Size.M, Size.L],
      slug: 'men_chill_quarter_zip_pullover_-_white',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Men's Chill Quarter Zip Pullover - White",
      gender: Gender.MEN,
    },
    {
      description:
        'The Unisex 3D Large Wordmark Pullover Hoodie features soft fleece and an adjustable, jersey-lined hood for comfort and coverage. Designed in a unisex style, the pullover hoodie includes a tone-on-tone 3D silicone-printed wordmark across the chest.',
      images: ['hmq1bj9k6h2opay10yxg.jpg', 'rjcjeffn0jc247dfbdre.jpg'],
      stock: 15,
      price: 70,
      sizes: [Size.XS, Size.S, Size.XL, Size.XXL],
      slug: '3d_large_wordmark_pullover_hoodie',
      type: Type.HOODIES,
      tags: ['hoodie'],
      title: '3D Large Wordmark Pullover Hoodie',
      gender: Gender.UNISEX,
    },
    {
      description:
        'As with the iconic Tesla logo, the Cybertruck Graffiti Hoodie is a classic in the making. Unisex style featuring soft fleece and an adjustable, jersey-lined hood for comfortable coverage.',
      images: ['ormhegiv58arvfdivuc4.jpg', 'uvkwrwbmppitarmcw3rh.jpg'],
      stock: 13,
      price: 60,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'cybertruck_graffiti_hoodie',
      type: Type.HOODIES,
      tags: ['hoodie'],
      title: 'Cybertruck Graffiti Hoodie',
      gender: Gender.UNISEX,
    },
    {
      description:
        'The Relaxed T Logo Hat is a classic silhouette combined with modern details, featuring a 3D T logo and a custom metal buckle closure. The ultrasoft design is flexible and abrasion resistant, while the inner sweatband includes quilted padding for extra comfort and moisture wicking. The visor is fully made from recycled plastic bottles. 100% Cotton.',
      images: ['tauzsezzrzpero8mwwqs.jpg', 'ce01qilnaedkx5xebxu2.jpg'],
      stock: 11,
      price: 30,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'relaxed_t_logo_hat',
      type: Type.HATS,
      tags: ['hats'],
      title: 'Relaxed T Logo Hat',
      gender: Gender.UNISEX,
    },
    {
      description:
        'The Relaxed T Logo Hat is a classic silhouette combined with modern details, featuring a 3D T logo and a custom metal buckle closure. The ultrasoft design is flexible and abrasion resistant, while the inner sweatband includes quilted padding for extra comfort and moisture wicking. The visor is fully made from recycled plastic bottles. 100% Cotton.',
      images: ['xjsfsi4dmrnulzhmpdck.jpg', 'dtizift2tvhwsc1ib5g0.jpg'],
      stock: 13,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'thermal_cuffed_beanie',
      type: Type.HATS,
      tags: ['hats'],
      title: 'Thermal Cuffed Beanie',
      gender: Gender.UNISEX,
    },
    {
      description:
        "The Women's Cropped Puffer Jacket features a uniquely cropped silhouette for the perfect, modern style while on the go during the cozy season ahead. The puffer features subtle silicone injected Tesla logos below the back collar and on the right sleeve, custom matte metal zipper pulls and a soft, fleece lined collar. Made from 87% nylon and 13% polyurethane.",
      images: ['majbtc3jg6lp1s7fizlr.jpg', 'fomvyjwrhjetrxbtmwxg.jpg'],
      stock: 85,
      price: 225,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'women_cropped_puffer_jacket',
      type: Type.HOODIES,
      tags: ['hoodie'],
      title: "Women's Cropped Puffer Jacket",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Introducing the Tesla Chill Collection. The Women's Chill Half Zip Cropped Hoodie has a premium, soft fleece exterior and cropped silhouette for comfort in everyday lifestyle. The hoodie features an elastic hem that gathers at the waist, subtle thermoplastic polyurethane Tesla logos along the hood and on the sleeve, a double layer single seam hood and a custom ring zipper pull. Made from 60% cotton and 40% recycled polyester.",
      images: ['g7ticy6g6daltmhypjsq.jpg', 'yfihavvuwhf4ukpltrdt.jpg'],
      stock: 10,
      price: 130,
      sizes: [Size.XS, Size.S, Size.M, Size.XXL],
      slug: 'women_chill_half_zip_cropped_hoodie',
      type: Type.HOODIES,
      tags: ['hoodie'],
      title: "Women's Chill Half Zip Cropped Hoodie",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Introducing the Tesla Raven Collection. The Women's Raven Slouchy Crew Sweatshirt has a premium, relaxed silhouette made from a sustainable bamboo cotton blend. The slouchy crew features a subtle thermoplastic polyurethane Tesla wordmark on the left sleeve and a french terry interior for a cozy look and feel in every season. Pair it with your Raven Joggers or favorite on the go fit. Made from 70% bamboo and 30% cotton.",
      images: ['gyltscxkpnfufgowvitp.jpg', 'nn1agtmktqeeksswrt2q.jpg'],
      stock: 9,
      price: 110,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'women_raven_slouchy_crew_sweatshirt',
      type: Type.HOODIES,
      tags: ['hoodie'],
      title: "Women's Raven Slouchy Crew Sweatshirt",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Women's Turbine Cropped Long Sleeve Tee features a subtle, water-based Tesla wordmark across the chest and our T logo below the back collar. The lightweight material is double-dyed, creating a soft, casual style with a cropped silhouette. Made from 50% cotton and 50%",
      images: ['uenvzsvslyh6zput1al1.jpg', 'iglmfla08a4adgl2troa.jpg'],
      stock: 10,
      price: 45,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'women_turbine_cropped_long_sleeve_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's Turbine Cropped Long Sleeve Tee",
      gender: Gender.WOMEN,
    },
    {
      description:
        "ntroducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Women's Turbine Cropped Short Sleeve Tee features a subtle, water-based Tesla wordmark across the chest and our T logo below the back collar. The lightweight material is double-dyed, creating a soft, casual style with a cropped silhouette. Made from 50% cotton and 50% polyester.",
      images: ['xk6fkv2sngq57qeurjtq.jpg', 'mdmhkiq8umsjitedzdyq.jpg'],
      stock: 0,
      price: 40,
      sizes: [Size.XS, Size.S],
      slug: 'women_turbine_cropped_short_sleeve_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's Turbine Cropped Short Sleeve Tee",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Designed for style and comfort, the ultrasoft Women's T Logo Short Sleeve Scoop Neck Tee features a tonal 3D silicone-printed T logo on the left chest. Made of 50% Peruvian cotton and 50% Peruvian viscose.",
      images: ['h912rcukrejrf8c4tr5e.jpg', 'vsgqdeoz8epxcf2ljgiz.jpg'],
      stock: 30,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'women_t_logo_short_sleeve_scoop_neck_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's T Logo Short Sleeve Scoop Neck Tee",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Designed for style and comfort, the ultrasoft Women's T Logo Long Sleeve Scoop Neck Tee features a tonal 3D silicone-printed T logo on the left chest. Made of 50% Peruvian cotton and 50% Peruvian viscose.",
      images: ['uv81i1cgjkogzzdqmopa.jpg', 'xszdxwh2ggggcwkczgg6.jpg'],
      stock: 16,
      price: 40,
      sizes: [Size.XS, Size.S, Size.L, Size.XL, Size.XXL],
      slug: 'women_t_logo_long_sleeve_scoop_neck_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's T Logo Long Sleeve Scoop Neck Tee",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Designed for style and comfort, the Women's Small Wordmark Short Sleeve V-Neck Tee features a tonal 3D silicone-printed wordmark on the left chest. Made of 100% Peruvian cotton.",
      images: ['x3cgvdtqht9xlh00pw9x.jpg', 'a2z1infka9nz9ujqy42h.jpg'],
      stock: 18,
      price: 35,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'women_small_wordmark_short_sleeve_v-neck_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's Small Wordmark Short Sleeve V-Neck Tee",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Designed for style and comfort, the Women's Large Wordmark Short Sleeve Crew Neck Tee features a tonal 3D silicone-printed wordmark across the chest. Made of 100% Peruvian pima cotton.",
      images: ['iftectnwkkccvx6oj3h2.jpg', 'isfcih9jcdd4fh0wcym1.jpg'],
      stock: 5,
      price: 35,
      sizes: [Size.XL, Size.XXL],
      slug: 'women_large_wordmark_short_sleeve_crew_neck_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's Large Wordmark Short Sleeve Crew Neck Tee",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Designed to celebrate Tesla's incredible performance mode, the Plaid Mode Tee features great fit, comfort and style. Made from 100% cotton, it's the next best thing to riding shotgun at the Nürburgring.",
      images: ['bg6xp5vkxwjgqquqapad.jpg', 'rtilqsounmqzaxgqo3t9.jpg'],
      stock: 16,
      price: 35,
      sizes: [Size.S, Size.M],
      slug: 'women_plaid_mode_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's Plaid Mode Tee",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Inspired by our popular home battery, the Tesla Powerwall Tee is made from 100% cotton and features the phrase 'Pure Energy' under our signature logo in the back. Designed for fit, comfort and style, the exclusive tee promotes sustainable energy in any",
      images: ['ndh9yh8zbwhajzmvv2so.jpg', 't9ehknmswn33gogqbl9d.jpg'],
      stock: 10,
      price: 130,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'women_powerwall_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Women’s Powerwall Tee',
      gender: Gender.WOMEN,
    },
    {
      description:
        "Fully customized and uniquely styled, the Women's Corp Jacket features a silicone-printed 'T' logo on the left chest and prominent Tesla wordmark across the back.",
      images: ['tkjphglbok6ynfwyo4ym.jpg', 'yytegy5iab2ahtbfwrsy.jpg'],
      stock: 3,
      price: 90,
      sizes: [Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'women_corp_jacket',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's Corp Jacket",
      gender: Gender.WOMEN,
    },
    {
      description:
        "Introducing the Tesla Raven Collection. The Women's Raven Joggers have a premium, relaxed silhouette made from a sustainable bamboo cotton blend. The joggers feature a subtle thermoplastic polyurethane Tesla wordmark and T logo and a french terry interior for a cozy look and feel in every season. Pair them with your Raven Slouchy Crew Sweatshirt, Raven Lightweight Zip Up Jacket or other favorite on the go fit. Made from 70% bamboo and 30% cotton.",
      images: ['z4u3pinzgbmmqrmjwtil.jpg', 'gi1nsepqp9pz6qy2jk4r.jpg'],
      stock: 162,
      price: 100,
      sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL],
      slug: 'women_raven_joggers',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: "Women's Raven Joggers",
      gender: Gender.WOMEN,
    },
    {
      description:
        'Designed for fit, comfort and style, the Kids Cybertruck Graffiti Long Sleeve Tee features a water-based Cybertruck graffiti wordmark across the chest, a Tesla wordmark down the left arm and our signature T logo on the back collar. Made from 50% cotton and 50% polyester.',
      images: ['uih2nqskgmvf2essrgx5.jpg', 'dqaogzjibh3puuhnaov5.jpg'],
      stock: 10,
      price: 30,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_cybertruck_long_sleeve_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids Cybertruck Long Sleeve Tee',
      gender: Gender.KID,
    },
    {
      description:
        'The Kids Scribble T Logo Tee is made from 100% Peruvian cotton and features a Tesla T sketched logo for every young artist to wear.',
      images: ['tdflfa4jjkrpyth2b6of.jpg', 'wnkgp1fspnmotdl1f9qb.jpg'],
      stock: 0,
      price: 25,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_scribble_t_logo_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids Scribble T Logo Tee',
      gender: Gender.KID,
    },
    {
      description:
        'The Kids Cybertruck Tee features the iconic Cybertruck graffiti wordmark and is made from 100% Peruvian cotton for maximum comfort.',
      images: ['o5jt1kij2wziqqyynmu7.jpg', 'qmzeyjgch7yo2a9xzrco.jpg'],
      stock: 10,
      price: 25,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_cybertruck_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids Cybertruck Tee',
      gender: Gender.KID,
    },
    {
      description:
        "The refreshed Kids Racing Stripe Tee is made from 100% Peruvian cotton, featuring a newly enhanced racing stripe with a brushed Tesla wordmark that's perfect for any speed racer.",
      images: ['s3nm5saoxwdpaekyr7ek.jpg', 'luje1k8ygfydqkfgm7fk.jpg'],
      stock: 10,
      price: 30,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_racing_stripe_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids Racing Stripe Tee',
      gender: Gender.KID,
    },
    {
      description:
        'Designed for fit, comfort and style, the Tesla T Logo Tee is made from 100% Peruvian cotton and features a silicone-printed T Logo on the left chest.',
      images: ['rapn0tpv33kyhkp1nbuu.jpg', 'tqkfl7tawdk7xxtnqxbr.jpg'],
      stock: 10,
      price: 30,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_3d_t_logo_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids 3D T Logo Tee',
      gender: Gender.KID,
    },
    {
      description:
        'The checkered tee is made from long grain, GMO free Peruvian cotton. Peru is the only country in the world where cotton is picked by hand on a large scale. The 4,500-year-old tradition prevents damage to the fiber during the picking process and removes the need to use chemicals to open the cotton plants before harvest. This environmentally friendly process results in cotton that is soft, strong, and lustrous – and the tee will get even softer with every wash.',
      images: ['orstfpjo1ucjhahpqqlx.jpg', 'zhzu86uicqefwdb5uxco.jpg'],
      stock: 10,
      price: 30,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_checkered_tee',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids Checkered Tee',
      gender: Gender.KID,
    },
    {
      description:
        'For the future space traveler with discerning taste, a soft, cotton onesie with snap closure bottom. Clear labeling provided in case of contact with a new spacefaring civilization. 100% Cotton. Made in Peru',
      images: ['bfbpinshm5fyp5hzhtf7.jpg', 'v4p2ededuzd8ew96f6so.jpg'],
      stock: 16,
      price: 25,
      sizes: [Size.XS, Size.S],
      slug: 'made_on_earth_by_humans_onesie',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Made on Earth by Humans Onesie',
      gender: Gender.KID,
    },
    {
      description:
        'The Kids Scribble T Logo Onesie is made from 100% Peruvian cotton and features a Tesla T sketched logo for every little artist to wear.',
      images: ['hreel3iswmtkvua2gv7v.jpg', 'zpzcycnfekxdnej6uw2s.jpg'],
      stock: 0,
      price: 30,
      sizes: [Size.XS, Size.S],
      slug: 'scribble_t_logo_onesie',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Scribble T Logo Onesie',
      gender: Gender.KID,
    },
    {
      description:
        'Show your commitment to sustainable energy with this cheeky onesie for your young one. Note: Does not prevent emissions. 100% Cotton. Made in Peru.',
      images: ['jubtrhpjdjtqifqrfeuf.jpg', 'tpwkiy6wuqv8bzdqihgo.jpg'],
      stock: 10,
      price: 30,
      sizes: [Size.XS, Size.S],
      slug: 'zero_emissions_(almost)_onesie',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Zero Emissions (Almost) Onesie',
      gender: Gender.KID,
    },
    {
      description:
        'Wear your Kids Cyberquad Bomber Jacket during your adventures on Cyberquad for Kids. The bomber jacket features a graffiti-style illustration of our Cyberquad silhouette and wordmark. With three zippered pockets and our signature T logo and Tesla wordmark printed along the sleeves, Kids Cyberquad Bomber Jacket is perfect for wherever the trail takes you. Made from 60% cotton and 40% polyester.',
      images: ['tulwwvm8dvoswhvu39l8.jpg', 'ezl7cgvslsg03mhdf1bt.jpg'],
      stock: 10,
      price: 65,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_cyberquad_bomber_jacket',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids Cyberquad Bomber Jacket',
      gender: Gender.KID,
    },
    {
      description:
        'Cruise the playground in style with the Kids Corp Jacket. Modeled after the original Tesla Corp Jacket, the Kids Corp Jacket features the same understated style and high-quality materials but at a pint-sized scale.',
      images: ['crere1lkjuxjhgfgvdif.jpg', 'isxtmwtwrkrxir5c39to.jpg'],
      stock: 10,
      price: 30,
      sizes: [Size.XS, Size.S, Size.M],
      slug: 'kids_corp_jacket',
      type: Type.SHIRTS,
      tags: ['shirt'],
      title: 'Kids Corp Jacket',
      gender: Gender.KID,
    },
  ],
};
