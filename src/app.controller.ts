import { Controller, Get, Render, Res, Query } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  getIndexPage() {
    return { user: { name: 'Алексей Ващенков', age: 20 } };
  }

  @Get('/meal')
  @Render('meal')
  getMealPage() {
    return {
      meal: {
        title: 'Паста с креветками',
        image: '/img/pasta_with_shrimps.jpg',
        ingredients: [
          'Паста - 200 г.',
          'Креветки - 500 г.',
          'Лайм - 1/2 шт.',
          'Соль, перец по вкусу',
        ],
        steps: [
          'Нарежьте овощи.',
          'Взбейте яйца.',
          'Обжарьте овощи на сковороде.',
          'Добавьте яйца и готовьте до готовности.',
        ],
      },
      swiper: false,
      form: false,
    };
  }

  @Get('/meal-map')
  @Render('meal-map')
  getMealMapPage() {
    return {
      categories: [
        {
          name: 'Завтрак',
          meals: [
            {
              image: '/img/yougurt_cereal.jpg',
              title: 'Йогурт с гранолой',
            },
          ],
        },
        {
          name: 'Обед',
          meals: [
            {
              image: '/img/chicken_with_pasta.jpg',
              title: 'Курица с макаронами',
            },
            {
              image: '/img/pasta_with_shrimps.jpg',
              title: 'Паста с креветками',
            },
            {
              image: '../img/chicken_with_pasta.jpg',
              title: 'Курица с макаронами',
            },
            {
              image: '../img/pasta_with_shrimps.jpg',
              title: 'Паста с креветками',
            },
          ],
        },
        {
          name: 'Ужин',
          meals: [
            {
              image: '../img/profile_pic.jpg',
              title: 'Лёха',
            },
            {
              image: '../img/no_photo.png',
              title: 'Не Лёха',
            },
            {
              image: '../img/profile_pic.jpg',
              title: 'Лёха',
            },
            {
              image: '../img/no_photo.png',
              title: 'Не Лёха',
            },
            {
              image: '../img/profile_pic.jpg',
              title: 'Лёха',
            },
            {
              image: '../img/no_photo.png',
              title: 'Не Лёха',
            },
          ],
        },
      ],
      title: 'Карта блюд',
      swiper: true,
      form: false,
    };
  }

  @Get('/profile')
  @Render('profile')
  getProfilePage(
    @Query('loggedIn') loggedIn: string,
    @Res() res: FastifyReply,
  ) {
    if (loggedIn !== 'true') {
      return res.redirect('/login');
    }

    return {
      user: {
        name: 'Алексей Ващенков',
        age: 20,
        image: '../img/profile_pic.jpg',
      },
      swiper: false,
      form: false,
    };
  }

  @Get('/add-new-meal')
  @Render('add-new-meal')
  getAddNewMealPage() {
    return {
      title: 'Добавить блюдо',
      swiper: false,
      form: true,
    };
  }

  @Get('/login')
  @Render('login')
  getLoginPage() {
    return {
      swiper: false,
      form: false,
    };
  }
}
