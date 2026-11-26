/* ============ عزل بيانات المتصفح لكل برنامج (عند تشغيل أكثر من برنامج على نفس النطاق) ============ */
(function(){try{const t=(window.APP_CONFIG||{}).tenant;if(!t)return;const P="p:"+t+":",S=Storage.prototype,g=S.getItem,s=S.setItem,r=S.removeItem;S.getItem=function(k){return g.call(this,P+k)};S.setItem=function(k,v){return s.call(this,P+k,v)};S.removeItem=function(k){return r.call(this,P+k)}}catch(e){}})();

/* ============ ثوابت ============ */
const SURAHS="الفاتحة:7|البقرة:286|آل عمران:200|النساء:176|المائدة:120|الأنعام:165|الأعراف:206|الأنفال:75|التوبة:129|يونس:109|هود:123|يوسف:111|الرعد:43|إبراهيم:52|الحجر:99|النحل:128|الإسراء:111|الكهف:110|مريم:98|طه:135|الأنبياء:112|الحج:78|المؤمنون:118|النور:64|الفرقان:77|الشعراء:227|النمل:93|القصص:88|العنكبوت:69|الروم:60|لقمان:34|السجدة:30|الأحزاب:73|سبأ:54|فاطر:45|يس:83|الصافات:182|ص:88|الزمر:75|غافر:85|فصلت:54|الشورى:53|الزخرف:89|الدخان:59|الجاثية:37|الأحقاف:35|محمد:38|الفتح:29|الحجرات:18|ق:45|الذاريات:60|الطور:49|النجم:62|القمر:55|الرحمن:78|الواقعة:96|الحديد:29|المجادلة:22|الحشر:24|الممتحنة:13|الصف:14|الجمعة:11|المنافقون:11|التغابن:18|الطلاق:12|التحريم:12|الملك:30|القلم:52|الحاقة:52|المعارج:44|نوح:28|الجن:28|المزمل:20|المدثر:56|القيامة:40|الإنسان:31|المرسلات:50|النبأ:40|النازعات:46|عبس:42|التكوير:29|الانفطار:19|المطففين:36|الانشقاق:25|البروج:22|الطارق:17|الأعلى:19|الغاشية:26|الفجر:30|البلد:20|الشمس:15|الليل:21|الضحى:11|الشرح:8|التين:8|العلق:19|القدر:5|البينة:8|الزلزلة:8|العاديات:11|القارعة:11|التكاثر:8|العصر:3|الهمزة:9|الفيل:5|قريش:4|الماعون:7|الكوثر:3|الكافرون:6|النصر:3|المسد:5|الإخلاص:4|الفلق:5|الناس:6".split("|").map(s=>{const[n,a]=s.split(":");return{n,a:+a}});
const GR={5:"ممتاز",4:"جيد جداً",3:"جيد",2:"مقبول",1:"إعادة"};
const ATT={present:"حاضر",late:"متأخر",absent:"غائب",excused:"مستأذن"};
const ATT_CLS={present:"p-ok",late:"p-warn",absent:"p-bad",excused:"p-info"};
const KIND={hifz:"حفظ جديد",murajaa:"مراجعة",tilawa:"تلاوة",tafsir:"تفسير",program:"برنامج",other:"أخرى"};
const TRACK={hifz:"مسار الحفظ",tilawa:"مسار التلاوة"};
const ROLE={director:"مدير البرنامج",admin:"مشرف عام",supervisor:"مشرف حلقات",teacher:"معلم",assistant:"معلم مساعد",examiner:"مُختبِر",student:"طالب",parent:"ولي أمر"};
const roleLbl=o=>o?(o.role==="parent"?"ولي أمر":ROLE[o.role]||""):"";
const STAFF_ROLES=["director","admin","supervisor","teacher","assistant","examiner"];
const PERM_GROUPS=[
 ["الطلاب والأعضاء",[["view.students","عرض الطلاب وملفاتهم"],["students.edit","إضافة الطلاب وتعديل بياناتهم وملاحظاتهم الثابتة"],["members.approve","اعتماد تسجيل الطلاب الجدد"],["members.manage","إدارة كل الأعضاء وأدوارهم وحذفهم"],["circles.manage","إنشاء الحلقات وتعديلها وتوزيع الطلاب"]]],
 ["المتابعة والتعليم",[["daily.log","التحضير وتسجيل المتابعة اليومية ووضع التسميع"],["logs.delete","حذف سجلات المتابعة"],["plans.edit","تعديل الخطط وخريطة الحفظ"],["tasks.edit","إسناد المهام وتعديلها"],["sessions.manage","إدارة مواعيد التسميع"],["programs.manage","إدارة البرامج المصاحبة ودروسها"],["recits.review","تقييم التسميع الصوتي"],["notes.private","رؤية الملاحظات الداخلية وكتابتها"]]],
 ["الاختبارات والشهادات",[["exams.manage","تسجيل الاختبارات وتعديلها"],["certs.issue","إصدار الشهادات وحذفها"]]],
 ["التقارير والإدارة",[["reports.view","عرض التقارير"],["reports.export","تنزيل التقارير ونسخها"],["admin.dashboard","لوحة المشرف ومقارنة الحلقات"],["tatt.manage","تسجيل حضور المعلمين"],["settings.manage","إعدادات الحلقة والخصوصية"],["ui.customize","تخصيص الواجهة: القوائم والمسميات والألوان"]]]];
const PERMS=PERM_GROUPS.flatMap(g=>g[1]);
const ALLP=PERMS.map(p=>p[0]);
const DEF_PERMS={
 admin:{scope:"all",perms:ALLP},
 supervisor:{scope:"circles",perms:["view.students","students.edit","members.approve","daily.log","logs.delete","plans.edit","tasks.edit","sessions.manage","programs.manage","recits.review","notes.private","exams.manage","certs.issue","reports.view","reports.export","admin.dashboard","tatt.manage"]},
 teacher:{scope:"own",perms:["view.students","students.edit","members.approve","circles.manage","daily.log","plans.edit","tasks.edit","sessions.manage","programs.manage","recits.review","notes.private","exams.manage","certs.issue","reports.view","reports.export"]},
 assistant:{scope:"circles",perms:["view.students","daily.log","tasks.edit","sessions.manage","recits.review","reports.view"]},
 examiner:{scope:"all",perms:["view.students","exams.manage","certs.issue","reports.view"]}};
const SCOPE={all:"كل الطلاب",circles:"حلقاته المسندة",own:"طلابه وحلقاته فقط"};
const TAJWEED=["المدود","الغنة","النون الساكنة والتنوين","الميم الساكنة","القلقلة","مخارج الحروف","صفات الحروف","التفخيم والترقيق","الوقف والابتداء","اللامات"];
const PKIND={tafsir:"تفسير",tajweed:"تجويد",mutoon:"متون",tadabbur:"تدبر",sira:"سيرة",other:"عام"};
const DAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const DEF_CFG={circleName:"حلقة القرآن الكريم",leaderboard:false,boardPoints:false,showPoints:true,parentsEnabled:true,studentSeeGrades:true,studentSeeNotes:true,studentSeeReport:true,parentSeeReport:true,parentSeeNotes:true};
const LOGO_MARK="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABgCAYAAAB7YK6NAAAUhElEQVR42u1daXiV1bV+1/6Gc05yTuYwhoCCgAIqkzIIqFRLnVAoUXFAr6BitVhqh2t7He59bluvrYpc29prFQdqCaLWCQcmrWUKgjxMAglTAgkJORnO9E17r/sj4IAiCZlj1vPkT56Tk/29a+01vGvt/RHamfS76J6+AZ9xb8Dvu0wIomjCej1me4/sXfHk4fb2LNReFtp7wt0DU5P9P0rymxclB/wrB/bq9l56WsC/ZU/plNLy6iFx215QWlP1l8rVz0Y6wW8iGXjpj4ebunlPWkpwbLfMlHfP7J395sEjkdE795ZOl6zcM3t3/3NKMLlwy56SmZGYNSAaS8zbVrT9RRS+a3eCf4pyxsV3jwsFA/cGfP7+acFA/tn9eny8fd/hCUeqIrNittfD81wAgGmaSPYZn/TL6fKH9NRkb+OO/TOjCSstHrce3f7BE0sAcCf49RNx5iVzvu8zzR9npafk9uyS8bd+OV0Ktu05eHVRcdlUR3IXKT3Q8XiSgKFpyEoP/evM07o+BugpWwuLZ4drY7FELPHbz1Y8+UEn+CeQs86aZqJnr8mBgHFPMOA3c7plPtena9b+gu1Fk2ti8RstVwaVlCc3YhLQNYGMUPIb5w/p++zu4rL0IzWxuTW1sX3xROI3ny2bv7YT/KPSffjtSRnZydcbuj4zOyNN9e/d7fkkQyvbXXL4loPl1ZfZrvQp5TV4kSQ0+AxNpQQCz104sn/+tj2l5x4oq7o5Yduf1kajvy1a+cdt31nwcy+YnR4K+mcEkwK3BAP+sr49Mp/zQIm9xeW3RuKJq2xPCWbZqMUxA0LT4TNEIrdr5sKzB+S8sPvAkSsLSw5fGY0nlkcTiUf3rfzj/u8M+AMn/ihTNwN3+Qx9ao8uGSWD+vZ8Plob9xUeKp9dUVU7xvEUGgv615QAQAgdPkNU9OmW9czZ/XNWrN+274pwJHZ5TW0834o6TxR+PL+iQ4M/8OJ7hwVDvhczUkKbh/TrufBgWTi95EjVXXHbG+14HsCqWRfDIOi6jlDALO+RmfrIkP59tn20aed1NbH4qGgs8VevtvrpnS1cI7QI+P0nzM0Kper/Gtw35ymS6khxOPJAuCY6wJMSYNWi1sYAdN1AarK/6PQe2X/I6Z5VsmH7nlnl4drcRMKet/39x59rqbVoLfFPup01+t6s9CDSgskbNxeVLKyNJbJYyVZJwQkAK4W47WaUV0UvL60InzGob86LPTNS36mNJ+5LzR0xuLxwzXsdBvweA8bcn5OV8VJJRfinMcvLISigDWQazAqWK3uUHqmdbLtut0tHnT33QGnFfUk5Q/cdKVq3q9mLmhZ5UsXJwYAJISinzuIbDx0JDSABbqznZAXLslBaGb1o1YZtc7pnp//ZZxjTWwIWvQVdrQCIGxMwNU2DgILPNIqYVZGu6z5W3MdyvN6uYuAUFUsEMEscrAjnBiLmXxXzZR0J/FPWGJEGXdfgM0RJl7SUN/rndlvGBG3d9r1IMnTt7H65lu3axs795XmVtZFJnkToGymI+qlBxmyHiVsmGOltE3SCpukwNVih5MDyAbnd3kgPBosLSw+PX79tzy8t1xWW5eyOEMSqSKxfWijZ65oeemH4wN5P7y4+fPnB8qq8hCt7ep57ikpoGdHbkpULoUMXQDDZvzUjmLzozNO6rztSEzt914GyK6Jx57SE66x2E959O+SmNfjwQw8Aek+Y4Y/EUi45UhW5fX9Z+K6uGaG3v3feWbft2Huob2Ukfkd1JH62VApKyTbHIuqt71YENKEhYGrh1FDyW/16dflHwPSpz/YdnLRq484f2q5XarvOy1WO8/ah5U9VHv8d+z983gLwJoA3+028Z2gkZt1eXBb+Q0Zq8uZz++Y8pDT4t+wuvrY2mrjckawr6bUZJeitleiRpsHUyEsPJq/tmpGa369X9u5dB8rP3bGv9Gc10YRhO847CcuZXrhi/vZjfzX8jQ1JOvGF1lsfXaP2lgyCRgBoiyD1980jUz4sfPjhTQBmD/jej3pELeumyprYf6QkB6rO6NV9SZfU4F83FxVPKg9HplmOly2l1+pUf8uAL8gBNDCzXzcM+HRR2D07/c0Bud2Xh2siGcXl4av3riufHU3YG23HfWjnPrUKhfM/70QNz189hAh55HhTWdCZ5LggIQAhQCRGK+nNGrI+uoYm/fRZx7Ve/2zZU4cAPIKcaU+eeVavq6oisVkBn5me0yXjzR+MP/2G7bsPDisuO3KD7akhjuu2eJXdsuAzHMt2nV7dsvL7+Yz1Ib+/rKikfOLaLbt/Uxu3qmzHWxyJ2PcUr37q0LE/Gb3kX108FpcBNB3gccL0+VkpqOpqlpVhBpSAYjBkXbYotDEAjTGF74H38m/524WDIi/5Bi3etqMEiwAsGvj9OaMjscQdByuqrkvyGytHnXPGr6NxK7Oo+PCN4drYeAVNl9ITLemTWgR8TQghoVJMoe/YU3z4pmjCybJse6XtyNt2Lntiw+cWvmGDgb3uWCKe7im6QphmdzBDeS6UbQGaBlUTYdgOQYjjaqW6HN+VWq7l6r+UEPeEN+W9x0zPZAxNXUY0bw2ANb0n3NEnJRi6tao29l/poWDZwD49XgglBx7fvq/0+sMVlaGIZRG1kAZaBHxXSbOkoupRy7LXWJ7zZ1kbeffLDOKof6zup1wxhfd514IwTJh+sOdCOfbXOAGurGYoFieqzaVS+KxYyEvOoWTT0KZ4nppS9WnNxvCma58zDfVKcPDT+wA8mDnmZ7/vmghPDddGZyYH/EndslPzp104/P2Fy9eGPEe5HQV8YsbvDtfG9ha9/3jhsV+e89rKNJ8KfI9BN0hHTRQ+MwQpwdKrs/ITdEhUZdVJOZsDFTpcyXA9CSLA0MUwTaNhtsP3V2269hUIXpB+zqMbK4EFABb0v+Tei2uj8TtLyipvzgilRg5XVpd0vE7Wgw+K4YMnjRQkrgWpq0nTTyMSYM8Fq3oEPaXYfn0Zc7haHO92joknCQN6Ouovd5WTJvgrfIamEUxDg+1IG4pXkEbPpGWopZS7OAEA/SfcPdBM8t8OKGxd+tjcDgH+8CUbumvsTQXhOmacL0xTZ88DS68hGRM4ElP2q+8THJdAdAK3A2QGlVowp4zSQ4q+SaeCCKYpoBTDk2o7g14gQ72cMXjxgbpP5GtAnkR7ZTUrPr4q9IXF2j/XkoPzoeljAdaVbTUM+KOTCVwbA2wXJwL+qI4QsQSFoxqLE/B4ihmWLeG4CpomzvKb4ndwaWN4U94zlRunjmFe3DIZeFN/YfjTaRdEt1yXj4Dv37/w1WQo1wG7Tl1n+xT3qKquYShFJ2MobZeootpgUY997boKCUuCQJk+U7vNNIyPwp/Qg+0m4O56Z5Ivq1vqJAi+C4omJoV0zXZ5/he4cZOUkhyuqdfnPAWUVQsSDXCqUjESlkRSQNcYss8XicGmNJOdLgVTzt/VpsCv2jQ5TUlzGmnidk3QCE0TsB2JhCXr2kRNKVKBqyP0bS7ny1JapatT2dnMDAI+94m6m+jFglaNfGXdYiHUvHVTRu9oVfArt1zbizzczOBbfX6tr1IM11VwvWban0Rgx2GOxuqcej2yiMPVmlDcFH1WTzJrqcLvv0PZ9vTzlqxdCIn56/NGbW9R8MMbpg0hjWayh+v9psh2vLrA1fwJMQEJm9myqZ6JESojGnuyrlblpth3tqWBKESGeadi54bzXlm7COT+7/qp4zY3J/hUvnHaeJ1oNoArfaaWZLsKcasFQP+y5UfjgOvhRPn98bqqjgmyXGKfwU3XT1GqrgAUIkSGOVM5PH3EkrX5JL15BXkXfNpk4O9dOcOflp64nBizFXCRz9SE7bQw6F+mFSJRQDHVx4sTAZEEwfGI/SYTNzVzfEwJJJI0w7yFgbzzXlm7mDV6ouCa8z89ZfBr1l2dKQ1fHmDdrglxLhFBukeDaCuKqo1y/TcKw3YFRRMCqUmy+WpJ/kIJwjRnsOvknbdkbb5Sct6GaWM31Rv8qk3X9lFQt0imGaYp+ijFcNzWn685xulwbYwaUrZbLqmETSwIerObzRdKCJBpziDXyRv56rrFiuW8T6aO2XhC8PnAtEDlEXoQhJkBQ89ssSDa0DQznuD6ppkgQCpocVe0sJF8oQRhGDfD4byRS9YtFpLnrcsb9cnXEoNwBf0yya//AkBm3JLwPNW2gCcCu55CIkGoZ9VEAKQiRONCkWiNnXpUCWC/MIyblIaPRy5Z++LIxR+P+Ar4DFzuuhJStt0RCzguse1SA2MiJxxIamV3qWwLYPYLw7wRQv/niFfWvnT+a2uHH+V2WLRh2OvYTMtWcL36u52jub3TVqZFvqQEzTRvUAofj3xlza9EWz6t97kTsR0BpUSDx8+kaFtDYUeVQIAfrB4QQNs/rKoStgdmRgcRVgogYYr2sFhybL3x48htTQOMdgE+J2w+tXDBqi0/V/sA3zklvpR1jeV3Dvy6Ux/UdHcfeNJAg2eFQMkmie+g5RMY7DaVb4TnUUMHcDXBnBKUQqnGAqRrzUUOtQu3g4YiyICpM6cEVKP7KZKUr7nOrgkGec2PHvlOuZpQzMr13IYUWIqBUEAhNUkKxdSW60ckmns2kahxvWJqYCGomJCVIhEMKLTlfKcdFFlEpGtGQwYglAJysyT7DCZGJ/iNS500rcEBt38PF6KNl2XtwfIBXVcNAd6nMw/qbZHkTvAbL2b9m1FSEnKzPO7X3SUpqc0aFDPb7YPbSQrUO2B7CpgwOIGUgCLFbdqdqvYBfnKSqs+BWsVAWpLiScPi5Km2/1yiPbB/FEomaFp9Gl64YkRcnd7VIU9SJ/hNcGkGKClA8BnfOuHsSiA32+MbLqwVnmof7HP7sPyADxQMMhSf0N0YGnju5GrumuaRVOgEv8nE0El0SedvsnzFgJTEd19Ww+MHxUUD++yd4NcneRc9u9HxQVcqAAyec0U1Xze+Vjhe+2p26WgnrKbolkUUSmaO1s3vOB4hPVnxfVdX8feHxYTjNdURjJa1fNku/H5SgMTpuWApYbmEQb0cNX9WOSYNiwnbbX/AH7P8BFH7sH7trH4kC/eryQPCmHNVDaUmS7Lc9ttX19vTYqU/CYMH++WvJlca0AXam49vnwGXCCwVq4/W8rb1VfrK7UFlaO1/jKd9UMoE9lZvVFy4T3gQ9PvX0mjrPh/7DG6264A6DvjMxadMrmsavC27WG4r1KDr0AQQjmr0q4WZ2FHsY38TK4CIIBmVHcjy+V3l2AoNjeyagDpcqbwNWwia+FLNxThYqdPcZ7Pw8Y6A8huMpkgaCKgbkRe0osOAX7Dtg3Ws1KuaL9AwJKSEu24zvumuBUNnVEY0+sXzWbRgRYoiAHoj40AgoMN25EfZwa7LO47lP/ywYuH+WNqJAs0fQL3MVNMgiw4oPlgmTsRo6hrDU6An30oTDyzMVFVRjU2dT6lZlhTQYdneDlPoM6n/fLtDBdxPpk4ohRA/ULb9DAkB0vSTXKDgsLd550kVJQjwGYz3NieJOf+XzXsOm6ohgdjQ6171YdvyBU+6E1OHvby7Q2Y7BVPOr1z/w1GzlOddz4pLhM9/Ql8vDxxirqwS9Tl3CwB+g/HZIVP85Jls2rbff9JMiAgI+DUopYo9KaenD100o8uI10pbLIljcKukmhvyxv7dcePjlOsuIcMEHe9WpILcubfBU3o+nXGoSqP7X8rkPWWmMk7ggnSdYOgCtiMXJeLeuMxhi19uBa7QarU8f/P1F+0rmHLeNHasu8BUKUzf0b0ooKprlSo7QvW1enyl184oqdTEQy9noCaqsfalQ0+EOmtnhTJH8q0ZQ/Ov6zH21dZ6bwqLVq5cuSDvgj8puBcq11khTD9I16FKSo9mOKf2tT6DsfWAKZ56J10dKy90jWCaGlxXvuZIXJA1dNGC1q9wufUH6jZMHbs1pkI/UK79aygV49Ijjb7f0mcw3ixIEqu2JqnUoAADFZYj70w9J39q1xGLitoEvcCgeFtYyPa8wU7BD0f/t6qKXKoqwp8Iw9eoyWwigInouRUZojxMb3ueOz57eP7T1IauFW9z3M6Gf5u4Ol4SuVix+xgIHolTm84Wmg5DcNXOg2JOz9HXTM4e8epn6KSUTy6F6+fXAvjp4Ek/WQ5BjwtN76/qeSEeUd0rPVjKZQw1d8d7j2/Bd43VFMSNnvvf+u7j77DljJdSLiASoJOc8iGhg4FapeTPveCBy7csbbvAN5/l17nqRFN81da6NzzfOnjS3GUk6H+EZvRQx12/TiRAQoCl/CeUuHfLe49uBDr5/CaTre8+thAkxynpvgqwEpqBYz8Awkq5/1ETD17aXoBvVp9P1PQnAbe8/cQeAFMHXTZ3DJQ3lplTCNp+8nj5lg8e39s8lRARNdPdJXpznTVSipuNJ9n2zmOrAaxuEeuUdMgjDmu6maFcp+26HU0QkgM6onFvVSTivI4OIGvzxhwkYIZScr/w+YEmHPVoMvD9Pg0AIvGE+7D08ZWnXfSPanQQKZg29i3Hk2PZdV4iTft2Orwl3Y6uC2iC4HpyKcD3Zw5f/Ck6oGzOG3MQwE0j81cvhdAeET5/jrLtRt2YIxpTvicFNLDiEttVMz/YxVemD+2YwH9lF+SN+ZtueRco11lEhv51Ory5Ld80BTxPKcuSC9ijh7LOW1SM75CsuXHsfgDXjVy8eilp4rfC5+9+wrddnMTyVUMCasCvQUn+lJmuyBiWf1vmdwz4r8aCMc9LOzZOuc4S8U1NoZNmhYRofQMqESKWI/+z3KqZkDls0VJ0Cj65fmJRwdRR05TjzGLF5SdsjZ6Kz9d1AZ8p4DjyfQZNyBya/2D/Ue/WdsL+1VqsIG/MM3Cdccpx3qjPLiCibz+N6DMFwHzAcdWs9EK+LP3cv2/qxPlb3ND143cVbFl6jXKd2cw4TLpxQuaVmW06sjHvT6Yu7jz+6l5NI8WM1wi4L33oon2d0DZMhuevGiI0/5+IaCxLeRz7KqCkLPl/NtIFXZA1C5AAAAAASUVORK5CYII=";
const LOGO_FULL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAADwCAYAAAD1jg1sAAA540lEQVR42u1dd5wV1dl+3nNm7r3bO4ggKKggVVkEMQo2ul0BS4w1GhsKqJ8xKhIbJgKCnUSNmiDsoqgRKWoMUYoUKQsISO+wbL1728yc835/3EVBYQt7d9ld5vn99g90d+beM8+8vRBcVAkdLx3RDgp3aY0LwTqehFguWE/Km/3Sl+7pVB3kHkHF6DRgeCelcI+U4rdej5mYlZa4JyHOy/uLA80KSwOwHWeaFPzCqpkvLXFPyyXc0ROt//BzFPO9guT1KUmJMjnOM+OkrJSn33zx3qUAxJdz13SYNmven9Zu3XVNYbGfNfM/SOMvq+aMW+uenku4KqNDv5EXMKth0jCuSk9JRvOs5Bnt25z0zJ+GXb34H7lf9//3l0uHaKWan9Qsa9LEp2+b/tZ7X3ac8e33j+8u9F9dWhYMMvTrZOqJaz6buM09TZdwh0X2nXeakW0JfZgxwjDNizNTk9C2VbN/n3fm6c9ef+35S8a/8emlKzfseHTTzvxziv1BMDPivCZOapL+/W+y270w/PeDpg1/6q2u+cVlk7bsKT2ruKS4EMA428Cb6z8bt989YZdwAIAWg4fHpZbyZZroQZ/X1zPRZwZSEr2v33r1JX+7amD3jcOffOfS7fsKHt1dWHpOaVkQzBqCokfGDIAIaclJSE+Km9nh5BOefPZPv1s+ZsL0qxbkrf/T3pJQF3+pfwvAY5ES+cea3NfKXLodp4Q7tf/9yV4Yg1nzvXHxiWdlJseVnZiZ+votV/QY36tXduj2Ea9fvD1//0MlgfA5wYgFaAWiwx+VZoYQBhJ9HvvkZpmfXHFRj+eHXt1z5R2PvHbNvsKyF/eVBFv4/aWrBPEYnZSSuyZ3tOUS7jhBu4vvzZCG+VsQ3ZOQkHR6s/RE/2ktm7zx1F3Xjk/ISgg/OXbKXWs27rxv2+7C5mHLAmsNquIJMQNCGkhPinc6tT3pk4EXdH2o/wVnlj7xwgf3L1m7+f784mBGOBT8jiCeXjV77OcA2CVcI0WXQcObWw7fTKC7kxKTWsQZ+LFD6+avvvLcnTnFW4pDf3wj5w879hXet6fI3zwUDoOi2vKooJlhGh4kxnkKTmmW+frIoYNe7tIxS9066t37Nu7OH1YasNItOzLLMPBc3oyXvnEJ15hCG4MebK0cug3Md6WkpGZmJfvWt2yW+fzLT98+ecWKTSc/P+mTq/cVldxXGrSahyORGhHtVxIPgGl40CQtcf9Z7U954/n/u2Fsbu5s8b+V2yf+sGXPjflFpXAcNQVavbDmiwnLXcI15NDGJQ+cAUPcS6DfpaamJrXMSlnXrnXzMU88eM3kL774vs2sBaseXbNpx3V7i/we27ZBtajdNAPxcfFITfCua5GV/tzb4+754KPPFrfNnT3vT9v3Fl5X4g9YSut3CPTimjnjN7iEa0Do3P/+s2wthxlS3JCYkOhJ9MpZ5515xitPPjT4i4lvfHLq9+u2/9+2fQXXFZaGPLZtQYq6+frMDJCAz+vBCenJK3t0Of0vjw+7Ouepv35wxsZd+RO25/sv2L+/sBSEVz1O5JVlX766yyVcPUb7/iPOg+b7hRRDMlKSkZWSMPOMNs2e/vPDNyx64oV/tV+xfsdDRf7AUH8o4nUc+6fQRl3jQCglMT4Op510Ql67k5uMfOyBwf957Z1ZV/xn8ZrHduaXZvv9/nwS9AIJ8+28GWOKXMLVF4waJTos9PcB4X7DMAdlpSWjZdO0z3t3b//M7wb3XvTm+3MGLs7b+McfNu3sXha2pVYOqJ5826jEk4jzSN2iacanPTqe/Pz/3T/4+/uf+Pvla7fseawkaGUHg4ENYLyQVML/WrhwfMgl3DFNqI8coFk/6vF4e/kMEW7T8oTJN195wd8v6d1p0Z/GTB64cefeP+7YW9SzpCwEsK43RDucYyGEgeR4j27f+qRPr+7T/fl+F5+5+KmxUx9etnbrQ7sKyrJCwbJlguj59FDS9LlzRzsu4VC3Kajw1vjnpWGOTE9OCLZsmv5Gr+7txt5788Bdg/8w9rKC0sCjRf7AuWXhSIXB2voGzQwpTTRNS9JZ6UkT77rmvL/06pUduu9Pf7/7h007RxQGIpmWFZorYTyTN/vFBl0OJRvSh03POn98QmLK8LYts7648dJz+z7x4JA5X/w37zajaadJW3bvH1ZUFjzJsqJeZ0MhG4DoZ2WN0kCICktD5yxatfmWxcs3JrzyzB2vd22b8VJhUTjBUTw4ELF/l3FK9+wTTuu5ed+GhTtcCVeboY4BI4Ya0jPlzLYtZv/jxXuvvO+Jv12yY1/J67vyi1uEwmEA3Ghcbs2A1+PFSSekFbbISn32lWd+/9p33/3YetKHX/7xx617flsSCEEp5x+AfGb1rBc3uhIOsU+ye8M8uWlaEoZd36f36HE5F67cuGPqnsKSDMe2QNS44jtEgNYKBcVlcbsLSvt9PPu7q/ILira8+uzvnysoKP2gtCSYoiF/Z9vWkKw23Zfmb/xuS0P5bqIhfMikgDjb54s/o0l60ssdTmket89f9n5ZyIoXDUx1VvvhCMCyLezYV9Thm5Ub/3HdfS8tiTON7l9OfvKm87ucemlSfJwiaU7t2HdEO5dwsXzjHaengNYtUpNzHnzxX732FQdSxHGS+yYABEYwGMSqTTs6fjBn8TtX3vni7NsG917er2eHmzNSkrM06+cBJpdwsTp0QS2INRDBrvT0xL624xx3hVVEBAFGcWkp1mzZ3ffx8Tn/enLkdd8kecXbhmlc1r7/Q2e4hEPMIvSCiBAfL6XHNH04jiGIYFth7Cwo7f3MuNyLzurQenpCQqKEtns0hM9vNLQDZ65bXXogHSWlhBACSqmotyUltGYoxwGg69SWFEQIhMKYMue7+Panp38TKPMrSbKVS7gGjCjPJBLiPEjwGtsNIeZ0PL1V8bL1m+fYjlYXdG3Xd9WP21MtR/UpLA2eEgxbUNqp8zztopXr7aS4dJBoGN6TS7hf5DgZAj6vFz6PKD6paca3Xc5omfvoPVdPAyDHvvZx6tfflYmgcihYGnll+t/+rxRA+NFn3u2xcUf+sP2lgcuK/CGP49h1FqpJTownVg3njA1XkkXVpmGYSIrzIiM14YeWTdPfH9qr67u/6dN135NjJne5deQrb+YXl/UvKQtlKhA80sCCtZvQ96anS9JSEmf17tF+ypjHb74u99MFJ0/5fN6tZaHInYX+UGY4HC7P5brNccc94aIlahI+j4mM5Lii5DjflPPOPiN32O2DFvz3vyszc/6z5Ldjp311x97CstPKggHYjrOQICZJSZvBZJeUlbUsKUPP3QXFV+8uDAyd/c3y5RnJic9/+MZDLwKY8NDT79+46sett5SGrM5loTBYOS7xjjfCcXlky5AGEuM9TnJC3FetTkj/52t/vGsWkhB5amzuhZfdOubtQDgytCRkiXAouJUIL0gSU3+Y89JygPhwM0cKiwp+V1iIW3cnJE299LbnilIT41/6w+UX//PFJ256dcwr06/4ZunaG0oDwcv9IVuocnXrEq4RSzIGIKUBryGQlZayoU2LzJntT27x6t23918/7tVP29z21GuP7NpfeJM/rE4o9ZeGleaPDPA/lc/8z7pP/+qPXmncYa+/6rNxawE8dvqlI8aFAmXXbA747/J6faP//O4no5v+++upzTMznv16ylNXTXzj0+7fr9/+4OoN2/qURZxMy7IA5uOOfEZjdgBISPi8HiT5jLITMtO+aJqR8sr4p26dX7yl2Ddmymc3XfH7v/x9X2HJeRFHIxIJLwPTi9Lk6T/MfGlTde9X3mH/ZvvBo96x/aWX7NgXvmtPYfHQH7fvHXrpbWMWrVi3/YXXnrvj5tWrt2S889HcB1as3XZ5SSjcPhiOgI4j4hmNUpoZBpLjPEiK8y1o36bFR3cOveDDtm1bbRs/acaFdzzy+nsbt+/pH4jopGAosI+BNyTz5LhWwYVLJ02yccRavHHN7K07OmtBJwqCUApFAs7qvNkT1h38e+WNzp8D+Lxz/xFnlYVCt/+wacf1W+LjP7z89y9sP6V5kzduueK8cS8+cfOox1/44Potu/Mf2rh9T4dAxCFWqtETz2gMZVTR4KxAnM+DrNTEwhMyU6d1bNvqveF3DFz45Zd5rZ5+9ZMr/MHQ/fklwdZlwQCU0l+RwHsmnJnLZ72cf6Trdn5vdoIvIeUCGOYN1v8WXQTwCVJGj0wSQ2sZ6DRw5Hyt8XYCrM8XzXq59OC/Xzlr3DIA93UZNPz5YDB4/cZA2e935pc+u2bDjidOa9Xsw85tmj/3zP9df9YLEz/ttn7Hzsc2bttzUUkwkuDYjdfOMxpIItE6UgbANEwkxpnhZpmpi5ukpbz88jO3fwkg/Nhz/xpww/0vfbGnsOTCkoCFcDj0I4H+LARPWzN7fF5Ft+v+4cIuWutriXANSJxBBHBxMTMzWDkH5zcTiEQfKdEnrM11nfoN/ycM7+S8GWMOUckrZozfCeDFzn1Gvm5HwgN3hkN/yC8pu3HFuq03frl4zazunU99/a2/3H3VO1Nmn7hgxdb7t+7cd+P+ksCJlm03urBKgyAcMZcccDI1a0nCQLxPIis9eX1yvO/vV/XqMX3w4J6b35/2vx63jHh51Nbd+6+KKNGyxF8SAPMUIeU/DS3+u/KLsYEj3aPnh/OaOGQMgNY3sOZe0uvzsXLAWkOXBrQuKsWv0gjM4PKoKwnRVkjxtFb28I4DRvybhH4rb0bKPGC0/kniRe+fCyC3w8AR55aU2XeWBoJDdxX4+/930ZoVPTq1+WDS83c+C+Cp20e+el1JKDxyd35Je38wDH0MshjHvQ23LxKiE5tm7e3Ypvm0Tq2bvfvIfVfNKt5SnPjo61MGvz/7f5OLA5Gz/WUB2I6ziLV+ER7vJ2s+e+GIc9ra56zyJJH/XA1c5zAuJSmbk5DQjg0dCUd/SQpwaYARjFTYls9ag6M51XQhjJtty7npvTe3/e+GXoPf9Yetj9PO+qT44N9f/fm4+QDmd+h//9OlpaU3+f24rcAfHvO/JX8e0SQ9+c3fXtHrg0F9unZ98oXJF6zdunvYvmJ/v2J/SDqOA0FuEw1qd0jgg6MTfN4/NYnPOmF2ziP7LUf5HvnzP8/OLykZvnnnvr5lEZUQCQf3aFCOBH/QLmnH4tzc3CMmfM7KmX+qFOIqAoaCdbbw+sCODVaH+RPDgJO3zna+XWJAyiqfV8QWuHdgGe4eWIzSoN5E4MlaG//K6vbB2sOPpXg0TdmRK4lwl8fn65ES70VqQvz7l/ym8+R7b+n3xT9zv2n7yX8W3VEaCN5W6A+nWI6CFXauMb3Br1n58ono2byZ40a5hIsJ4YY/lRTve7xfz84Di/2Bvpt3F1y7rzjQqixQ5miNORD8L21Zs9d+9WrBka7RZfqyVNMJX0SCbgDzJcL0pLDWUZuMKyhAkQLW3O+UXrNJwqh6RX7EJvTpErKe/12+R0PCNAgRS5VCY4YmvJ2hU+dSt197xb17jzIK4v0Xaq3vkkJemZaaKpPjjIXdu7R564lhg6cGC4LJT7z+0c0/bNx+m78s8Mdtewq/TE50CRdTdOw/8kmfzzs6Mc6LkrIQIlbkB4A+ECZyywOvR3Jf6expi7JBeiiYrybDaE1CRqWZ1lWOtYQ//cpGfqEJUfXyQUcR2p1o69fu3ksek4kZEILgNQXClgYRFjLo7Qirj0/smntYT7nzoJEdbUfdIkA3JyenZqYlmHtTExJeHHbTgCk9epxWNGnSv3nM258kJaQl7wTEn1fNGvtnl3CIyYDnP5Mw77aVPUMQTy5Jom925B65G737h1+3gPIOYqLrQegpPF4PO84hHiaq2FTAZUEVmT6bELZEdWIVmoGUeO289+AekZGkhdKHNsmYpgARwbbUdiEwRVl4L6N7zqrDvnCXDWsKSw7VwO993riO6Sk+lZWa+P45ndq9uXVvyc458xZtAOuHV82eMNElXCwI1++BtsrkUEWDms/JmR+nDXG+1nwjAQOE6ckCM7RjV6wyK4IU0Lv2aeuz/wAkRHWD0FKAX79rv+rQKmTY6vBHbUiCaQpEIioAYI4k8VZyQtaXdPrLkV/+bqveo3xJXn9/TXynlHJARmoyUhI8Kzft3H8GlDM8b/ZLr7qEq2X0+GDBGdqLa8A0GEBnYZhgxwHrGBSJGQbslWtt9e1Sszr22wFYNvRzNxXovmcFjYhNlQhTgscUsB0NZiwF6/f8QTmt1XlTDjtJqUvf4d0t4jsEicGmJy5VW4FhK2e99LIbFqkFZP/r60zh8/aDwo2auLcwfPGsHLCjoK0IYporKyoWR1+dQmLbPh8DwcpVsGaEI9HUlmmIbCmMbIZ6tGjZ0GlQ/I+0bjnfHxJMnjN+EYBFZwwc+ayyw7dqljvdsEgM0XvU10agY0J3kLqOiC4nabQiANpxANa1dVuO/Psrh/cWVMthONhTvaxbIPLUDQXeyiTcYTW6jEq9UFhZgvAFCXo76ARmNe/2WRBwA7+1hm4537YNCuNdYuds4fEJdmywbdVuNw0ROBjW7A/Io01sCmLsKTY9EVswUdRTrQ6UYoSUgiDyeDxikFI8yCsSVhUsG/peRNs5J2Z/tLWhEa7etQkuWXKnydz7kBfBNM0WwuftASKhI+HDB2hrg3CBgEDYoqMmnCDsKZZ2yCJdk6yU5qi6tR0N06COPo/4i0+Yi/d/P+TN/cuv68ENaKxKvSFc0bKbU4uXDbmrJRXN3rs4o+Uv3nTNdg28zaMTT+ASv10TchMxysLkKQ1KGas5wratEQorECErzivvJK2/LVkxdM6u7we3d1VqFVCwaOhJZOJ3ikO3xvuMNk7ICSotuT7Uo+uiUoP46EcoEAGBEOl9xYZzUqblUTE0NQ+oWyIy4uKMS8J+60wAa1zCHYloy67rIKB/rzXf4PXILMdhRCIKzKgfm1pYMxeW2CDy1sQjiyiiwjIYtVXowcyIWAoCcH6dzvs6NW5TfmThyCGh45ZwhUuGns8Cdwnw5R6PTLLKVUQ0zkr1Zl4W2w64LGjGoBKSdhV4FRCsc/PF43j76tanPNwtZ8GLxYkZH28YeHrkuCAcr+/v3V+aPEAQ382CL/J5pBGxfiZafRzQxqGI5rIAg6jGRNlVKJxjpU2Ex+wGYEpasPC7bjkLxmcmZnw86xgSr1YPoXjlDWnKca4pCtCdpomzDSkRsVT9JdrBujAQJDhK1lTCEQFFAelT+thIb23bYMcGmWYPYkwpCBV+123agvHF8UUfbxg4MNIoCFeQN/QksvVNrJ1bPKY8jZlh2xqO00BmEpAAl/htOI4JwxA1dHaxt8iwwxZJ02DBx8gdYjtaCXWAeGmBtEXdchaML95dNH3DA3VHPCO2jsA1HYiMO+Dw9V6v0dRxogYtGmDLNJeUmUDN1SkRUBIG2w7gMY79CsGDiNedGB+knZi2uFvOgtetcGnOyt/1CzQIwu1bMvR8Q/IfwLjC6xEJBzsCaJhTnVkX18xDPTgWF7aEJxAxkBhn1ZtBlQcR72wBOtsrkh/o8eGCCaFA7RLvqAnHqwZ7im0ayIy7NfMlXo8U9doRqI79phRxMOyJRfyeCAiGSRX5hW6WDlPp+vV12bajo8kMswsIb3vjosRzTHPq0su7BY854YqWXZGqETe40NJ3Sim6GYJg2arhE+1gDzUcVlwW1CAyY8HfiAMuC4Prc9MVOwcTj94WlvVAt9x5E9nrnRJL4hlVj58NbgkpbtKsb/WY1IY5WrvlOECjG+McsSRsW8ROQ5NRFpYNIuF5MPEE0Vvasod1z503UcWIeJUSbs+SwZ1MotuZcL3PI5o4DjVQR6DqEk77yyJwlOdoSpKOVFa3v9SjgYBoKMdwMPGI6C1h2cO65c6baIXKptbExjsi4QqXDumlgT9IQZd5PCKxwTsC1VGpZSEDWiNWhAOAQj+FAcQ3OH/9F8TzCXl/t9x5L1vJCVNX9jszUCPC8dc3+wqSggOEQX8A00VxHmE0CkeguiERf1kMl5FHURZp2ONC2Cn3ag3zTCmNt7z+0LDuufMmlrGVs2bIhWWoTnkSA5S/ZMiNxWnhbwxTfOQxZF9mNkJhBa0ZOM5GY7I/YMfS4GIAYRtxjeJ4HBvatkDS6EKm960EEf9t99yFt7XP+TqxyoTbv2TI6Dif/KeU1E2paLEfH2c8+wlKA+GIL5bV94IAf9CEo0Sj2WfyM/FEF5hGOfHmVUo8Ubhk6PlC4FHL1rAsffwS7YD9ZtmKg0ErlgqQCPCHhGOrRrTy8GAbr5x4UYkXN68i4gkmvsZjCvO4U51HCpo5DnHYjqkoIgDBCBxm6MZ6dD9LPNn5Z+L9WtUKBpqwy7WfqRG2BJQ2Yr2OMmwRlG78K8IOJZ7xVoL0zus+bf7t2Z8uiS+34Vi7RDsoBhcIRuA4OtY+pWbgeHqvfyKeMDuT6f27iFize/5zXit3E80vBBxbtmCtqzvZoSq+iKE1xPF2pAfieMLrO89GaLxLuF9yLmyZFHPFx1AM43i2XLQVAQGDhEuxQwNmHAhY7kHU2uofj0u4X76JwbADd0NR7S2+dU/hF7Adn3sIOL43QtedeFOA7Qi4Is4lXJ1kGRylORxxYp9mJ0gBW5AbgnIJd2iwTMOyVW0IOElQRMQu4eohrCPNJ611wumqD5uuZrWIKaNJfHb3pdavwCsBVlxcXOgYEc6A1rI2GJfgYyGJyZVw9W4cJztZPl/kGKlUgGNPCs1AaqL2mAaJuhRxJOufQK2XKrU0YNGxcBpg2UAtqNToCH1bGVLXKQPY0QlUzzxu12moI8mdHIc6l9pMlFDfIjwu4Q6Nw3FtVaCekKp9fAzaM+qdSmWgIXTIpNR6MJYI2nYirHTM1zILYt0sPeJWHZZLuMJ6L3i0422owX9mIN4DNElhKLfyEAJc/4ORRIIbbiyZkBSvOSvFFlq7KTPXhjtIFJFhmCSEiKUdpzVwQqpGvJfh6lSXcL+IW0kZ6z3fmoGTm9g6zqvJ7R1xCVcXi6C4XQvbPWeXcIex7j0eQMqYXtJnMrdtHoHbhekS7nDxC40YhokUE5pnKG6VZQtHuQ6DS7hfL8fSMKQTu20xQHbrCCcnKNd+IwIz/C7hDoYhBHk9RqzcSUOy7tU+5JLtZxvZcQl3SFjEFBQXJ2PRG24rwqknKO50SthVp65KraBixOcJI0a1nAO6BpEYp8l1GFzCHbkANDnBrKlKVRponqF0v65+sl3p5hKuQs4lJzGjZlOObId48LkBbpKihHbzpy7hKmzUTU4AGUe/T9dWhHYtHH3Z2X5pOa50cwlXmeOQmCBgmvpo2l2YAUOw/kO/EkpNVK7t5hKuCoTzeYmS4uloUgMRhzD43BCf3yEoIrYr3VzCVamfzyRKT1HVlXARm9C9jeXc0bdQOK7d5hKuOp6qaJpJ4KqHay2H0Kapox8fUigTfZpcR8ElHKpTTySaZAiYZpX6GyyH0DxdqWd+W8DNMy03DOISrrpqVUOkJhGlp1Y60j1sE047wdHjbtuP05tHXK/UJdzR23Gi1Yk4kuPAHB0SfW7biDPu9ny0PiEiXSfBJVyN1Ko8ubmA1/yVlFMaUBr6xl4BNeZ3+bJJqi1cyVZ1GOSOkDpsIlSkpwrRopmjN20TB4oyLYeQlqD1sEGlPOjsUqmY4Cbmq0k4zfW/TfBYeauy/amkt+zQAETYJnRo4TiPDS6g9i0jMmKR2xRzdBIOyj0GHDYDL09sIpxWzZX14w4amG3rEVcWiLREJcKWK9Uax7iu+gYpidu3xY0tNtj3DSr0gBiuveY6DbVVbg4OBNhZ/gPKgiSFAJTbyOwSrtbIFgqzNWc+yx07jU+XxovPlyQ5Po9rtbmEi33nFmBZbH29UPHuvYIMCSKmiZ+l0JptPuU1XdI1esKRELrOSsyZYc37XvHWXQaMqIkrBVAUIPnUlAzs2G+ypz4uMaKGMe5HNIywmNrFjlP7y22lgL18raPXbZYwD/WnTIOxYbeUoyZn8L6S+kU6ZsBDDSO81SAIx5a1nlnvJSFr0yOF2r5HqaWrJKQ4LLW9JmP5Fo94+J1M3rrPo+uDehWCYFu6DI7a6BIuRlh644X7iehLMszaa9INhtiZvzTqilYwz8ZrMtbsMMXwt7J42Uaf9nk49ntEqgHTEAD4+zlb5FaXcLHkhKNe1bZlgUSteKXOih80FxRLyMqv7zEYOwqlHPFOFn00P9kxBKryZ7VYb0CThgzJVS7hYohF152/kJWaJD3emKtSvWe/Ums2iOoMsjElIxgBPf9hqhgzLcMJhEWd23XxcQbCETVrr49zXS+1FuDx8GOOFf5K+uJid1Gl2Pk+D7Adqq5ulAKQksW0BfHG8LeyeONub52FTeJ8EqGws84m5w8dO+ZaLuFqAfOvPM/vaPt6FQl9JDzemq8JlxJqxx6tt+8RRzumiwD4PIwVWz3i/klZ+HpFovKatWfXCUGI80mEI/praTgDT8z+aCvcOFztYfmQXvnxGZGh2rYeYnCpMD1HP3xQKXby1jFiEHDxGoyCAMnHJ6fR5P+mOIaIxpBjCa9HgMCBSEQ9FdaBS1M7f7QJbvK+9jH3wgsdAGOzc+Z/Q+y8JDy+ntq2UK0hNEJCbd+tedc+GSuL3xCAYojx/06hkqBUd/QtkoJQ42GEQhC8HgHL0ou1rR7M6P7hfMDNNNR9uGTIuYuMYqefssMvgGBVK2zCzGrtRo51Rl4QYEimv3+ZKF7+LEMRoUbq1RvdEm+FLf28ipRc0pDJRoBq8OVJ8+84zw/g0e653/6HweOF19deWxFU2AAjBLiklPWOPaI24hlEgMdgmvxNvEiK0+r2vkXScarX6SqI4PVKhMNqhYYzMiv7w6/QoAdTEVjr0kaTvF80+Lw5trIvUJHI30HEJI2K426bd2qEI6K2rHsiwJRMf/sigabPT3I81fBePaYACE4w7EwUInxBQydbo60WWT6kV/6SwT1/z8zXg3mb8Pp+PZqcANgW6807ACFqvRaACGLCZyli0bqESkMmREC8T0IpvZY1XZaVnfNA2lmfFMOtFqnfWHJtz6lQfIGyItOFYYAODnkIAV1YqrmwSNQ24Q7E6kI2iRemp2JPoakNeXjSmaaAEEJFLPV6OGj3zsieMgtueVIDUrFDztm8JG/Wtcp27mVGoTiQoSABtXMvw1Z19t1NydiyT8pXPk/VzMQHa3GiaBBXa96gFA9JOyvnnma/mb4Pbj1cA8To0XrJkJ6vMai3tiP/FV4fSDN4517UdcbdYzLmLPfJr5Yn6gMpMNMQkIIQDuv3Ssuod2b21I+ARl+AScWN/Usuuab7qnh/ZIBW9pNcFghwsd+IeVS2SktuiCZ9kYyCUoMT4yU08zal+PqM7Kk3tzpvyi7geCioZoocD1907q0Xhhdf1eNptWXnAI5ElgnDA9RxkawhGVvzTZnzbQop5UxlJXtlZOdMAY6nEnPi46oV6ftRN30DBC7WSk0EoGq1qPNXyQ0DHqn2fDg/4baEjrnXpWdP3gq4PQ2NHnkzXi/Km/niA9DqGtZ6k5AmannfK0hIsFKfKM3nf/fp2HcAt4nm+CPe7Jc+sczw+Urbk4kkqBaKO4U0wMz7ofietonbrlkzZ/wGuJ33xy/WffrqLgA3duw/4isiek4Io6nWTkxSOUQSWqlZJPDwyhkvrloJF6IeJt2cZNZ2Xd921axxb2tyLlTszBRCgmoQNiFpgBnFSquHPCf5L185Y+wql2r1kHBEBDAsJFrhY3H/1Z9P+MG7t+wKx3EeYcBPwqh2LktIA6zUXIf5olUzx45dOmmS7dLMteGOiKVLJ9mrZ4//qyJ9idZqoZBGlYLEJAwwc8BxnMdLg4n9f5g1bpl7mi7hqow1M8Yv0omJfbRyXgAQFtIsdyoOzUuRkFGpptUCaNVn9axxz26dOzrsnqBLuOqTLnd0Wd7McY9C6wu1Uu8z610AqwMSj1kHNOuF7Dj3JCTqi1fNnrDAPbWG5qXWw0B03qzxCwEszL50RKbD3FpppEhix9FyW2YwYevcuaMd1Mv52Fq4hKukHgygIPL31su5w0s/G7cfwH40nPWvu+rbXNh69QZ4TAEGf0YXznXgIgbnSV9oy1oc0z7exkA4IiAh3kBZ0P7eCTsvuVRBzPp4hUlDlBWZKUwP6jJvXG8J5zEFiKBDIfW2Y8mBjbn48Fjgu6t6btH7jSu0bT8AcIGI9aiMhmLDHei1jERUHjT/Mb1bzgyXHrVke97VzQYwsfuUhXOZ7bHC47mYHQd8DLbQHRMJ5/NKEFAWjqhnofn89G65LtlQFwOBzllRuLNwEFvOwwBKjoW0q1MJZ5SXVFu2+kpp8WhW9tQlLg3qFhseGBgB8OLZud/+Vzs8Vnq8vdix60zaibpyCuJ8Esx6Vzii7t31Iw/Myp7iku0YYvHg85YklIb7OXbocTAHhcfTOCScxxRwFHM4oicLwU9kdcvd7D5u1JuyewDPnp3z7X9gY6zweHtqxwZqUdqJ2nQK4nwSSuvVBL46o+vU36ad6ZKtXkq7IectUB7zEmVHngYodNQTqapGuNinknxeCSIEQxH110DE6p12Vs7H7mOt557s5d2CS64990kw+rPjLBYeH2pjvK3QjDKlYjNAz5AEn1fCcvi/EaUvyeya80iLHh8XuI+zAUm7a3v8DyFcoiPhF4koEmtpJ4hkWNdwgNnPTgH2hS394P744v4nZOe6lRMNNXxy0zmli4ec+zBrZxArZ7nw+mLWOF7jNkHTjIY6Ipaaamn9m8yuUyecfvqsiPvYGoMn+5uvPGH7ImWFJwLk1HRtAQNkxCBTsJ6JHs84KyfXfUSND9/eeH4RgAfOzpk/U4PHyqrM3zvy7IGwOLqpjBIAIuGwmmBo+ZuMs6a6ZGv0nuy5s9hj9mYr8gaIdLWlHRGIqMwAcZV3aUtJMA0By1bzHZsfa9I9d677KI4rT3Y/gLu7TZv/ORTGCa/v1OpIO2aQYEVOlZwCrwRrFEYi6v/KQnyJS7bjF0uuPfffjuX01rb9FpHQZFTdMqPCJYNbasJSQ4pMR/FhdzkxAKX0dLb48cxzcte4R+7iALrnzh/MJP8iPObJFUk7kga04ywR6d1yt2lNE7weCSl/XropBSE+zoDWeqPtqJvSu+Zc45LNxa9nK5+byzb10pHI+yQEKpytjPJZjPx1b6MgpckfDSGGEVEmEaCZi1njPVtZY5p0m77bPVoXlaFb7oLfEonnhcds8UtpJ7w+6EjozUNicDuXDG4ZRziThJSkeGVqt6kb3WN0UR30+GDBydqk50mK60jIqKdgGHBCwRUm8RXkHpGLWpF2OQuGkqAbQJQE6MWW4okrhpy70z0ZFy5cuHDhwoULFy5cuHCB+rTC0oWL2CD70lHxNpe1Zoe7gdADhGwGr/HangeWfvlCCeAOlXZRI4KNyAw5aCeIexCoe8QpPYuAVmQYHiICM0MKeXZY218BeN8lnIsqY/DgwXJDoGULR3EXIurBxN0thQ6S0OzAngvWGswM1qq84o0AaYIEnwx3bL6LiqXXnfGWSmhDwFnM6Lm2DNkMPk0YIpVIRPOkzGDW0Mo5aAStiG5/ZoBZRZQdWSW1/si14VwcgnYX35vhMb1nsKCzofkcJnQhoBUJw0eEqORifUhCnkgAFF2qzayhtSohiHWAXqpJLJCEZSVl+zdsnftu2CXccYzevUcZ+UlFJ5IyOkvQOcy6B4jaA2gmpEE/qUfwzwQjAiEqwQBAK4cZ2E3Mq5noOxAt1MLIy/L7dlU0gtYl3HGAzn1GJsCDU6B1V2bqCaKuDN1WCJlCJMAHqcdDexAOUo/aCTOwlZiXg2iBhliirNDatV+9WuCGRVzvMdN20I5BZ4O4JwOdCThZCMOLCtUjRQmmNTTrYgKtZ/ASJr1QMC33yMDGpZ9NCsKNw7kAQB0GDL9JCnETa65YPSJKrIPUIxi8i0CrwPwdAwtNIVYvS9i2A7m5yg38uvgVOvV7oC2TyJOGx2StomoSfBj1yGCtIgxsIWAZgIWasFh5POvWfjymwN0m6KJqkkNIZjBprUDRf0e9R63BWhcxORs0aLEgWuho/X28GdxcU/XoEu44hrmvbLPVJPEDANdp1nuJ9Rpm/o5hLFSCVv/wedJ2YLR2c6kuYob2gwd7RMlJrb0e7C9fYuLChYuaY9Qod0mci1pWqaNGiY4LS64lIa4BoTk05bPQH65K2PFBrF1pF8c54coTu5NIGDcecLUPrOxWjv0PnZR815rc0ZZ7vGjQ6a+dcYUSADxJ6Ryr53lUXmrESRglTc+N2rF/Grx0oBxFGp5bqMy/HMAE1HkK575TtOm9iTSfDII+KAm4WTv87uo547bX5v3PGTw8Luindoq4k2CcCkJzMNKPaqAtAUTkaHZyV8+cMLU2P3eXfg+crEicRSS6MPTpBMoqZH9qHJkmGOCyUt1pwIhSZi4g0GYG1hDL5So5fv2a3NFltSrhzhg4spVkvYJIpoD14eJB0ErlhWGfvWHWy3U2CbPdoGEdTW18JqTZCr+aPyagtbWRGANXzhy3PuZEHzDidDDdrAVfCcZpUhhmbPx/AmtHQ/HAlbPHzY7lZz61//3eOPJeA/BNAM4hUV52BC5PSPBhpmj9/KWUcmwCtgD0H2g1TSWn/K8qUrDaEs4g7kIkU460uYRZgwineGR8UwDb6iwOpeWjwjBbacc+7P8XhqeNduyRAO6KWRii9z2JMtH3MFjcR1KmC9blZTqx274ppEcoHT4PQMwI12Hg8AsFi2dI0LmAALMqL5pUlY1MPehVIJOITiMhTtOEu2RZ2aJOA4ZPaJe4Y2puBTZ8tb1LrVVcZYKRwWREnLrdlciiY0Xre1grgHVHxDCVJBN8swSZTwKcrpUdvUfMN+IyCMSxqdrNkR37D39SQM4kIc5lrcDaQfXHp5Y/5QPFl8wgIbqTMP61tqzlZx37jmgXu8UgbGxirfSRSEfRuql8JzWUX7cWHNfZ7uMug4Z3hzRmCWH8Riu7PG9Zv9H28oeTfvAvfE8a5miAvdGXI4anr6NSUkijP0nxZce+I/rEhHCclLiCGfOElEfI6RlgIHdN7mtlaIToPGDE6ZrFVCJ58k+l1fUcnQY9muaxVY40zBsOSKTaglY2SFBzIWlqh4HDL6wx4dbkjraI9YOs1F4hzfL5/dFqBGF4oOzIPK14TGMkW/Yl/5eimd8TQp7Muu7IxoA8+nTXKA/ryD+ENPtrZdfN59UKECJNsHi306AHW9d411be7Je+12z31Vr9G8wlAFvMvEcr6w0DvqvWzBlf2BgJFzGtUdLw9Ki2ZCsvbCQS0SoOIar4I8stYlp5tJ9ZBkofkNJzeVXJRiQghAEhTZAwQEJCSBNCGtF/V3EdUrl6PQlaTOzde5RR42qRVbMmrgRweftLh7WUKi5FstizfObz+Wik6NjvgZ5E4p6qeqDRAkcJZg3WOsJAAMzFTBys6loXgrRZ2x9mhpM/PCpV2v+RFszOw1Wy1w58XqV2s7b/R6AlGryHIMJMThqDWgLoROCuJORJ0ZCNqoJ6lYOK4kqvBTAlJuVJaz6buA2NHkwQIx4VQnqrIt2EMKC1UwCtpkNhJhm0Hhb2+aQVFomGXVVPthTxqmYRfudmKY2syj4zkQADAVbOWMOUby77dOyuI6rovsPTJfNFTPp+IWSvqpBZgx5udfOoj7e+Ozrs1sNVJW41aERn0qKfVqpSmURCQGsnRwr5+PIZf/0RxzA1VQj/lZV50NEmGl3AwPWrZo77olIBEzWXpp3a//5/xzM9SSQeY644HCWE6Jq4x98bwGzj59xo8pUAdwKYmJkgZBGxmpE3c3xerAxuy7QHM9FpdNApMGidDoZy18ytx16tg6uEaXgrtoOidppWetSqWUnPHOtix0JfsA0TOoAr/RgKGvevml052Q5GeRbp8Y4DRrSW0riuIilKQoC0uhbAbKPdlfdmWGHPB8IQfX55gFrzox37P3jvqlkv/auGbWpNIobzoTTM837tkhMQ772x06C7B+fNeL2oPqpTIUZewJU8OJISrO1xq2aN/3O9+NhkdxLCjKtI5ZGQ0Nr5atXs8VOOOtwOjNLKGQCilCOFW5g1CPSb7EtHxQsj4n1cGJ4+Wjk49McGkUghovHZ/R5sVqPYjKGHGYZ5nnZsHO4+huG9mDnuLtTLlruRGQCfVlHsikhAa3u9SoiMqjcfXMh2VBXfhPitmqRHVs4ctx7Ms4SQFYTkGQxuZanSNgLAgCO9BawVSMissBDZNXrZmHrqCtJOWmuAuWe91Ka2bgqmTK7gmZAQAFNOvQp2sz6pMq9UK1XMjlgQgxqDTyu0FaOpr3hN+jQBZk+lBNeqZmuBiUUVopv1smpYS5lBQngqknCsNUjrerV7jEGZFXGgvDJkR2YkqcZLXxSL5axVpKIcO5EAQbQQVUkME4ka5kKqkHwmqpcJSa2cuEolhdZBgLejflXWeqsQKyyoaA5IVWF6nV0A7atUhWtOc3sRavgiUJRzYWX6QvVLwnFKpZqLORyLexUXp4YBLqo0nk0i1SVc5UUoVIU6FaHsemYSEPkrr68lMxa3SvGUSWaOq6wogKAjjYJw2dl3miCYMVHtv4AkGahIUjADREj0kp1Wv2wBFFUmcBjcJDv7zhqTjqVMA6EpV+7sFjYKwoUyEpIYnFJ52Q37AKbqCTiZr1mHj6wuGCSkwZI61y8Bhw0VSbhobAyt7PSkFjWOwAj7NAIlVXb+DMpvFIQjw2xKoKyK0zgMEKX07v2UtzrXjqPwbjD2UoUeGIEVX1a/LAH+jllVHKqQZhIb+pIae6ka5x+Y1HTE2ymlANoh6shlqlUPlLTTlYT0VmgkR8mYXpxYmlGday+a9XIpgDWooCxHawUS6NOp3wNt6wvhpFfP11rtICErfgkZd2Zfemc8alBvB0LFOVsigFBiEq2vA8KNEmD2oRY5R4wbqLI+C2YQiTTtyDOq/76Izyq0h5ghhJHMUj5ZXwi34pMJxcQYe6AO74jxQ6JuYR3X6qjPvrT4UkHyzApTaCQAxgbR4vRdAmCjdqsWIJjhq63rd+z/4I0Qol9V6tRICALp31c/S6Q/0couqMjt18qBgLi+04ARD9QX0uX1SJ6oHedxBhdHiyp/8WOYYOblhomjCv6eMWjYaULIv6CSt52IwIS5SyfdZRsAkmq7B4SqIN6YSVVrzMQC/+kQPAREj4AgqyJAtXIAoms69hv5h1Wzx75Z1Rziihnjd3YcOHyKFPLeiqoiGEwg+munASPSyaFXV34xdt8xZdzo0ToPeLbjZcP+zg6dp6GaHQj0M0OQEH6l8WneJxOKq1PMcOYlj5yqTHUVNN1HQpxUeSGmoxn6EwCgTv2HF4JE2pHOnoSAVurqVbPGTz/quqy40oUkjewjfbBo8lvnkaA3Do57MbFDoFJmSiGwl1lnEomTwXwGE9pJaSZorarXFEJU3uur/yOAr5hRgspC5NF6qvYC4t5KO7SIQCShtbOTiL9lhRVEVbhH7RW7MACHwQ4J6F+YGQQNDwkyKg1+a05jwilg7kiE9kKYSVzeh1uxVjHAyp7vaRm4YOmkSbZRPzwqDRLUSZB89WDhzAecaaJybUbl/ZAMHLyQovrdhCSEcTERXVzVyFxVDvfA9ZkdCBLNSYihEDQU9bWNkKrR1WL8fPbVavZmDYDHL500ya5fEzCZodmpUtd3zPooa/klYqVxPENIA8qxZ2aEUj6uUdeWCxdVcNCgldpLrIcfXCDgEs5FLWQ5BJgRgVZ35c2esK7afanMmhrQty3v/xQAuSOMj4UaZXAJaXVL3uyXPql25325VxZoIKPjQQxLsX5Qa+cZAiJCGi7x6sD7iDZ4S2it5gpH91056/B9EkblETSGkEao3n7R8o0q0T0YKg/gx1bPHPcZAHQZ8OAsrXE/mPuTMFIObMVDtMa+LuffNC5yEX4a7wECtFIR1mohICapxMRpeRX00hpV8+jqQKWWb6urjkuvtXKYaQ8pvYgZH9ke+em6T//qP/ArK2a+NA/AvE6DHmzNjtOLBZ3P4PZgbkmEZAAJRNIVf9WAZm2D4WdwPrFeTYQFzGLOqllj86oSTDDqiyrU2vmWGY+jGtNiBaiUpWdL3owxFbYX5s14aROATQD+gVGjRKclkRQJlWnZTpoQFAc4LpOqcN4kba3BfjJlQSRi7zuaCadVIpwmlrUr3AhgbFg1a/zcOkr3FCH646KunYpKe3+EgIBIPtobRCdhU1WILd3HcRzISSYKCELakezn6KATnXm0N0hx4n2WaadUXu9OgUNzsL2NgriulwG4GILSiMQGzfaU1Z9P+AGH6eyHSUM1I5sImqG+81qBKUu/nFTiPuJ6JuEIXFpZs4VgPupGaEdGWgBoVmnSW/ys4tpdeW9GYXx2jpDGR9Lw3CuFcYMQ8kkB89sOA4Zfc/Cfdejz4G/YxDwScqKU4mYhxK1SeN6wzKQ5nfvcd4r7iOsZ4ZhpT0VxquhyVwzocsUDqUdzA0V0jRCGtzIHhhGtyerde5RhRryvC8NzFWsFrcrHQzg2CJQuSLzdsf+wzgDQadCDrYUhckjIU3/6vfLxEcIwu2vD/Fv7waM87mOuVzYc/1BZElpKo5WKyJuqe/FOFz/YmojuqazKIlqBgM0AUBjn700kBmvHOszvKQhhJAPyzujLIEYKaZ7Ih6ka0Y4FQfJi6fef7z7mekQ4DV5cabdNdLXRkx36jji3qhduP/CeE9gU75AwmlZIOCJo7QTA4odyN+UiqnAwigaAM3v3HuUj8HkVXZuEAAR1dR9zPXIapMQ3rFQRhEircNySEJkC/GnHASMfj2drcnlzCQ6z4SQ5HsZAZjGKpGhX2fBlIgFo/sGbX7qtvCMmrdL4ISGuMDESxwo+qjxb4HUfcz0iXN6M8Zs79R8xVwh5ZYXl01qDSGQQ0eshbY7o1H/4MgDrNKhUMBMEZYC5LYg6gUSb6PprVaXKAk3q06VLowV6zLSpQicmOjV9Z7v4jaVry1rsB4nTKxq6x6x3uo+5PoWPQax5xBuk1RWV7d5i1uXtneI0kuK0XwXy+KDKWK5SigFa2YVSq/d/VvJqhlJ4SpBIOJy6JADE9GFubq7q1H/kNCI6l49EZMcuYE1fuo+5ngV+Vydv/5K1/lxIo8rVrL8eLOhAa6dqZdg/dWxLaOixK2ZP2HLgv0XjbDwKv2xvI4IwPNDKmV4aSpwKACqU+DelrK+E4TmkIuRAaRITP17bGwRdVA9R63zNGs46vccyaBpKJOIBrpO6Ka3s/3plcNju9UsPGZ67b8PCBU3a9MgHREciSi3vPylh7bxjmca9G+c8FwSA/K1zrdR2534ulcoA0alEwkvR0vtNivUjq2eOn+Q+YtTfBb2d+o24HlK8T2BZm/ujomRTa5W0+1U0dj/70hGZEYc7EMggRZtWfjF285F+t0P/h9oIiVNI6bCjeU1jXU7S6DZCdxww/D5BYgJAojrqsepkM6G0ncdQQw+XpnJxPKjUQ9XZoqw2PXeAcIGQhi9WpCMhy2vd1XRJfGPe5y9tco/fJVw56RYsa9q6xxwGTgbRqVFngo+uqPKn0mO9Duz8Ma978h/3/m1MqXv0rkrF4UYqdFjo7yOEuAXEvcFoRkL83PAbnb7z84726KL2g/pMdbEgWgrgAwo4H66YW52RAi6OP8IdhLMuefhE23B6CIhuTNyJgZOIOQ1AMoMI0aVlhQDvJdBqZiwShMUrZ477EXXh9rpoEPh/Q5ct9xCXl/8AAAAASUVORK5CYII=";
const STAR=`<svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="22" height="22" rx="2"/><rect x="9" y="9" width="22" height="22" rx="2" transform="rotate(45 20 20)"/></g><circle cx="20" cy="20" r="4" fill="currentColor"/></svg>`;
const ICON={sun:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,moon:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,gear:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>`,up:"↑",down:"↓",xls:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8l6 8M15 8l-6 8"/></svg>`,pdf:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 14h8M8 17h5"/></svg>`,check:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5 9-10"/></svg>`,video:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-4v12l-6-4"/></svg>`,cal:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`};

/* ============ أدوات ============ */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>ymd(new Date());
const addDays=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return ymd(d)};
const dow=s=>new Date(s+"T12:00:00").getDay();
const LOC="ar-SA-u-ca-gregory-nu-latn";
const fmtD=(s,o={weekday:"long",day:"numeric",month:"long"})=>new Intl.DateTimeFormat(LOC,o).format(new Date(s+"T12:00:00"));
const fmtShort=s=>fmtD(s,{weekday:"short",day:"numeric",month:"short"});
const hijri=d=>{try{return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"long",year:"numeric"}).format(d)}catch(e){return""}};
const fmtDT=iso=>new Intl.DateTimeFormat(LOC,{weekday:"long",day:"numeric",month:"long",hour:"numeric",minute:"2-digit"}).format(new Date(iso));
const fmtT=iso=>new Intl.DateTimeFormat(LOC,{hour:"numeric",minute:"2-digit"}).format(new Date(iso));
const gen=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const initials=n=>String(n||"؟").trim().replace(/^(أ\.|أ\/|د\.|الشيخ|الأستاذ)\s*/,"").split(/\s+/).slice(0,2).map(w=>w[0]).join("\u200C");
const monthRange=m=>{const[y,mo]=m.split("-").map(Number);const last=new Date(y,mo,0).getDate();return[`${m}-01`,`${m}-${pad(last)}`]};
const monthName=m=>new Intl.DateTimeFormat(LOC,{month:"long",year:"numeric"}).format(new Date(m+"-15T12:00:00"));
const toLocalInput=iso=>{const d=new Date(iso);return `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`};
const n0=v=>Number(v)||0;
const nS=l=>(l.noteStudent??l.note??"")||"";
const nP=l=>(l.noteParent??l.note??"")||"";
function notesCell(l,who){
  const tj=(l.tajweed||[]).length?`<span class="small" style="color:var(--warn)">تجويد: ${esc(l.tajweed.join("، "))}</span><br>`:"";
  const tn=(cleanTN(l.tajweedNote)?esc(cleanTN(l.tajweedNote))+"<br>":"")+((l.marks||[]).length?`<button type="button" class="btn sm ghost" data-act="showMarks" data-id="${l.id}">مواضع التسميع (${l.marks.length})</button><br>`:"");
  if(who==="staff")return tj+tn+[[nS(l),"للطالب","p-pri"],[nP(l),"لولي الأمر","p-acc"],[can(me(),"notes.private")?l.noteStaff:"","داخلية","p-warn"]].filter(x=>x[0]).map(([t,lb,c])=>`<span class="pill ${c}">${lb}</span> ${esc(t)}`).join("<br>");
  return tj+tn+esc(who==="parent"?nP(l):nS(l));
}
const firstName=n=>{const w=String(n||"").replace(/^(أ\.|أ\/|الأستاذ|الشيخ|د\.)\s*/,"").trim().split(/\s+/);return w[0]||n};

/* ============ الحالة والتخزين ============ */
const COLS=["members","tasks","logs","sessions","programs","progress","config","circles","exams","certs","recits","tatt","messages"];
const LIVE={},DEMO={};COLS.forEach(c=>{LIVE[c]=[];DEMO[c]=[]});
let S=LIVE, MODE="loading", PREV="loading", DB=null, USER=null, UID=null, OWNER=false, ASSETS=null, DL=null, SLOW=false;
const READY=new Set();
const ui={mpage:1,tasmee:false,mstu:"",marks:{},msurah:null,cmode:"month",ptab:"programs",wk:null,skind:"all",pm:"this",from:null,to:null,rtype:"students",circle:"all",cid:null,view:null,sid:null,stab:"plan",date:today(),month:today().slice(0,7),pid:null,q:"",track:"all",teacher:"all",demoAs:null,rsid:null};
const chains={};
let modalCtx=null,modalPresetCircle="";

const DRAFT={};
const get=(c,id)=>{if(c==="config"&&Object.prototype.hasOwnProperty.call(DRAFT,id))return DRAFT[id]?{...DRAFT[id],id}:undefined;return S[c].find(x=>x.id===id)};
function stageConfig(id,data){DRAFT[id]=data?{...data}:null;render()}
const hasDrafts=()=>Object.keys(DRAFT).length>0;
function saveDrafts(){Object.entries(DRAFT).forEach(([id,d])=>{if(d===null)del("config",id);else put("config",id,d)});Object.keys(DRAFT).forEach(k=>delete DRAFT[k]);toast("حُفظت التعديلات");render()}
function discardDrafts(){Object.keys(DRAFT).forEach(k=>delete DRAFT[k]);toast("أُلغيت التعديلات");render()}
window.addEventListener("beforeunload",e=>{if(hasDrafts()){e.preventDefault();e.returnValue=""}});
function local(c,id,data){const a=S[c];const i=a.findIndex(x=>x.id===id);if(data===null){if(i>=0)a.splice(i,1)}else{const o={...data,id};if(i>=0)a[i]=o;else a.push(o)}}
function put(c,id,data){
  data={...data};delete data.id;data.updatedAt=Date.now();
  local(c,id,data);render();
  if(MODE!=="live")return Promise.resolve();
  const k=c+"/"+id;
  if(OFF.on||!navigator.onLine||OFF.q.some(x=>x.c===c&&x.id===id)){offQueue("put",c,id,data);if(navigator.onLine)setTimeout(offFlush,500);return Promise.resolve()}
  chains[k]=(chains[k]||Promise.resolve()).then(()=>remotePut(c,id,data)).catch(e=>{if(isNetErr(e)){offQueue("put",c,id,data);return}console.error(e);toast(errMsg(e,"تعذّر الحفظ"),"err");reloadTable(c)});
  return chains[k];
}
function patch(c,id,p){const cur=get(c,id)||{};return put(c,id,{...cur,...p})}
function del(c,id){trashAdd(c,id,get(c,id));local(c,id,null);render();if(MODE!=="live")return;if(OFF.on||!navigator.onLine||OFF.q.some(x=>x.c===c&&x.id===id)){offQueue("del",c,id);if(navigator.onLine)setTimeout(offFlush,500);return}const k=c+"/"+id;chains[k]=(chains[k]||Promise.resolve()).then(()=>remoteDel(c,id)).catch(e=>{if(isNetErr(e)){offQueue("del",c,id);return}console.error(e);toast(errMsg(e,"تعذّر الحذف"),"err");reloadTable(c)})}
const cfg=()=>({...DEF_CFG,...(get("config","main")||{})});

/* ============ الأدوار ============ */
function realMe(){if(MODE==="demo")return get("members",ui.demoAs);return S.members.find(m=>m.uid&&m.uid===UID)}
function vMember(role){const st=S.members.filter(x=>x.status==="active"&&x.role==="student");return {id:"pv-"+role,role,name:(ROLE[role]||role)+" (معاينة)",status:"active",virtual:true,childIds:role==="parent"?st.slice(0,2).map(x=>x.id):[],divisions:[],circles:[]}}
function me(){const r=realMe();if(ui.asId&&r&&(r.role==="director"||isPA(r))){if(String(ui.asId).startsWith("pv-"))return vMember(ui.asId.slice(3));const x=get("members",ui.asId);if(x)return x}return r}
const isOwnerM=m=>false;
/* مسؤول المنصة: التصميم والتخصيص وإدارة البرامج. إن لم يُعيَّن أحد بعد، فمدير البرنامج هو المسؤول حتى يُعيَّن */
function isPA(m){if(!m||m.status!=="active"||m.virtual)return false;if(m.platformAdmin===true)return true;try{return m.role==="director"&&!S.members.some(x=>x.platformAdmin===true&&x.status==="active")}catch(e){return m.role==="director"}}
const realPA=()=>{try{return isPA(realMe())}catch(e){return false}};
const isStaff=m=>m&&m.status==="active"&&(STAFF_ROLES.includes(m.role)||isOwnerM(m));
function roleCfg(r){const P=get("config","perms");const base=DEF_PERMS[r]||{scope:"own",perms:[]};const o=P&&P.roles&&P.roles[r];return{scope:(o&&o.scope)||base.scope,attScope:(o&&o.attScope)||base.attScope||"data",perms:o&&o.perms?{...Object.fromEntries(ALLP.map(k=>[k,base.perms.includes(k)])),...o.perms}:Object.fromEntries(ALLP.map(k=>[k,base.perms.includes(k)]))}}
function can(m,k){if(!m)return false;if(k==="ui.customize")return isPA(m)||(!!m.virtual&&realPA());if(isOwnerM(m)||m.role==="director")return true;if(k==="perms.manage")return false;if(!isStaff(m))return false;const ov=(m.permOverrides||{})[k];if(ov===true||ov===false)return ov;return !!roleCfg(m.role).perms[k]}
function scopeOf(m){if(!m)return"own";if(isOwnerM(m)||m.role==="director")return"all";return m.scopeOverride||roleCfg(m.role).scope}
const isAdmin=m=>!!m&&isStaff(m)&&scopeOf(m)==="all";
function attScopeOf(m){if(!m)return"data";if(isOwnerM(m)||m.role==="director")return"data";return m.attScopeOverride||roleCfg(m.role).attScope||"data"}
const attRestricted=m=>attScopeOf(m)==="circle";
function inMyCircles(m,s){const c=get("circles",s.circleId);return !!c&&((m.circleIds||[]).includes(c.id)||c.teacherId===m.id)}
function canAttend(m,s){if(!can(m,"daily.log"))return false;if(!s)return true;if(!inScope(m,s))return false;return attScopeOf(m)==="circle"?inMyCircles(m,s):true}
function inScope(m,s){if(isStaff(m)){const L=divLock(m);if(L&&!L.includes(divOfS(s)))return false}const sc=scopeOf(m);if(sc==="all")return true;const c=get("circles",s.circleId);if(sc==="circles"&&(m.circleIds||[]).includes(s.circleId))return true;return s.teacherId===m.id||(c&&c.teacherId===m.id)}
const teachers=()=>S.members.filter(m=>m.status==="active"&&["teacher","supervisor","admin","director"].includes(m.role)).filter(x=>staffDivOk(x,me()));
const allStudents=()=>S.members.filter(m=>m.role==="student"&&m.status==="active").sort((a,b)=>a.name.localeCompare(b.name,"ar"));
function myStudents(m){m=m||me();let st=allStudents().filter(s=>inScope(m,s)&&divOk(m,divOfS(s)));if(isAdmin(m)&&ui.teacher!=="all")st=st.filter(s=>s.teacherId===ui.teacher);return st}
const nameOf=id=>(get("members",id)||{}).name||"—";
const sessStu=s=>s.circleId&&get("circles",s.circleId)?circleStudents(s.circleId).map(x=>x.id):(s.studentIds&&s.studentIds.length?s.studentIds:(s.studentId?[s.studentId]:[]));
const isGroup=s=>!!s.circleId||(s.studentIds||[]).length>1;
const sessTitle=s=>s.circleId&&get("circles",s.circleId)?"حلقة: "+get("circles",s.circleId).name:(s.studentIds||[]).length>1?`مجموعة (${s.studentIds.length}): `+s.studentIds.map(nameOf).join("، "):nameOf(sessStu(s)[0]);
const circleStudents=cid=>allStudents().filter(x=>x.circleId===cid);
function myCircles(m){m=m||me();if(isStaff(m))return S.circles.filter(c=>divOk(m,divOfC(c))).filter(c=>isAdmin(m)||c.teacherId===m.id||(scopeOf(m)==="circles"&&(m.circleIds||[]).includes(c.id))).sort((a,b)=>a.name.localeCompare(b.name,"ar"));if(m.role==="student")return S.circles.filter(c=>c.id===m.circleId);return S.circles.filter(c=>(m.childIds||[]).some(id=>(get("members",id)||{}).circleId===c.id))}
const scoped=m=>{const st=myStudents(m);return ui.circle==="all"?st:st.filter(s=>s.circleId===ui.circle)};
function groupHTML(st,fn,cls,headFn){
  const by={};st.forEach(s=>{const k=s.circleId&&get("circles",s.circleId)?s.circleId:"";(by[k]=by[k]||[]).push(s)});
  const keys=Object.keys(by).sort((a,b)=>!a?1:!b?-1:get("circles",a).name.localeCompare(get("circles",b).name,"ar"));
  const single=keys.length===1&&!keys[0];
  return `<div class="stack" style="gap:22px">${keys.map(k=>{const c=k?get("circles",k):null;const acts=headFn?headFn(c,k||"none"):"";
    return `<section class="cgroup">${single?(acts?`<div class="row">${acts}</div>`:""):`<div class="cg-h"><div><h2>${c?esc(c.name):"بدون حلقة"}</h2><span class="small muted">${c?esc(nameOf(c.teacherId))+" · ":""}${by[k].length} طالب${c&&(c.days||[]).length?" · "+c.days.map(x=>DAYS[x]).join("، "):""}${c&&c.time?" · "+esc(c.time):""}</span></div>${acts?`<div class="row">${acts}</div>`:""}</div>`}<div class="${cls}">${by[k].map(fn).join("")}</div></section>`}).join("")}</div>`;
}
function circleFilter(m){const cs=myCircles(m);if(!cs.length)return"";return `<select data-change="circle" id="cf">${[["all","كل الحلقات"],...cs.map(c=>[c.id,c.name])].map(([k,l])=>`<option value="${k}" ${ui.circle===k?"selected":""}>${esc(l)}</option>`).join("")}</select>`}
const DAYCODES=["SU","MO","TU","WE","TH","FR","SA"];
const platName=u=>{u=String(u||"").toLowerCase();return u.includes("zoom.")?"Zoom":u.includes("meet.google")?"Meet":u.includes("teams.")?"Teams":"الاجتماع"};
const hasTime=c=>!!(c&&(c.days||[]).length&&c.time);
const schedTxt=c=>{const d=(c.days||[]).map(x=>DAYS[x]).join("، ");if(!d&&!c.time)return"حلقة دائمة بدون وقت محدد";return (d||"")+(c.time?(d?" · ":"")+"الساعة "+esc(c.time):"")+(c.time&&c.duration?` (${c.duration} دقيقة)`:"")};
function circleCal(c){const t=c.time||"17:00";let d=today();for(let i=0;i<7;i++){if((c.days||[]).includes(dow(d)))break;d=addDays(d,1)}
  const st=new Date(d+"T"+t+":00"),en=new Date(st.getTime()+n0(c.duration||60)*60000);const f=x=>x.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.name)}&dates=${f(st)}/${f(en)}&details=${encodeURIComponent(`${cfg().circleName}${c.meetLink?"\nرابط "+platName(c.meetLink)+": "+c.meetLink:""}`)}&location=${encodeURIComponent(c.meetLink||"")}${(c.days||[]).length?"&recur="+encodeURIComponent("RRULE:FREQ=WEEKLY;BYDAY="+c.days.map(x=>DAYCODES[x]).join(",")):""}`}
const teacherOf=s=>get("members",s.teacherId);
function canSeeStudent(m,sid){if(isStaff(m))return true;if(m.role==="student")return m.id===sid;if(m.role==="parent")return (m.childIds||[]).includes(sid);return false}

/* ============ حسابات ============ */
const logsOf=(sid,from,to)=>S.logs.filter(l=>l.studentId===sid&&(!from||l.date>=from)&&(!to||l.date<=to)).sort((a,b)=>a.date<b.date?1:-1);
const tasksOf=(sid,from,to)=>S.tasks.filter(t=>t.studentId===sid&&(!from||t.date>=from)&&(!to||t.date<=to));
function stats(sid,from,to){
  const L=logsOf(sid,from,to),T=tasksOf(sid,from,to);
  const c={present:0,late:0,absent:0,excused:0};L.forEach(l=>{if(c[l.attendance]!=null)c[l.attendance]++});
  const counted=c.present+c.late+c.absent;
  const grades=[];L.forEach(l=>[l.newGrade,l.revGrade,l.tGrade].forEach(g=>{if(n0(g))grades.push(n0(g))}));
  const avg=grades.length?grades.reduce((a,b)=>a+b,0)/grades.length:0;
  const excellent=grades.filter(g=>g===5).length;
  const done=T.filter(t=>t.done).length;
  const sess=S.sessions.filter(s=>sessStu(s).includes(sid)&&s.status==="done"&&s.start.slice(0,10)>=from&&s.start.slice(0,10)<=to).length;
  return{logs:L,att:c,rate:counted?Math.round((c.present+c.late)/counted*100):null,
    newPages:L.reduce((a,l)=>a+n0(l.newPages),0),revPages:L.reduce((a,l)=>a+n0(l.revPages),0),
    tPages:L.reduce((a,l)=>a+n0(l.tPages),0),errE:L.reduce((a,l)=>a+EC(l).e,0),errT:L.reduce((a,l)=>a+EC(l).t,0),errL:L.reduce((a,l)=>a+EC(l).l,0),
    avg,tasks:T.length,done,sess,points:done+2*(c.present+c.late)+3*excellent};
}
function streak(sid){let d=today(),n=0;for(let i=0;i<60;i++){const T=S.tasks.filter(t=>t.studentId===sid&&t.date===d);if(T.length){if(T.every(t=>t.done))n++;else if(i>0)break}d=addDays(d,-1)}return n}
function totalPages(s){const p=s.plan||{};const L=logsOf(s.id);return n0(p.basePages)+(s.track==="tilawa"?L.reduce((a,l)=>a+n0(l.tPages),0):L.reduce((a,l)=>a+n0(l.newPages),0))}
const gradeTxt=g=>n0(g)?GR[Math.round(n0(g))]:"—";
const gradeCls=g=>{g=n0(g);return g>=4.5?"p-ok":g>=3.5?"p-pri":g>=2.5?"p-acc":g?"p-bad":""};
function amountTxt(l){
  const out=[];
  if(l.newSurah||n0(l.newPages))out.push(`حفظ: ${esc(l.newSurah||"")} ${l.newFrom?esc(l.newFrom)+"–"+esc(l.newTo||""):""}${n0(l.newPages)?` (${l.newPages} وجه)`:""}`);
  if(l.revDesc||n0(l.revPages))out.push(`مراجعة: ${esc(l.revDesc||"")}${n0(l.revPages)?` (${l.revPages} وجه)`:""}`);
  if(l.tSurah||n0(l.tPages))out.push(`تلاوة: ${esc(l.tSurah||"")} ${l.tFrom?esc(l.tFrom)+"–"+esc(l.tTo||""):""}${n0(l.tPages)?` (${l.tPages} وجه)`:""}`);
  return out.join(" · ")||"—";
}
function gcal(s){
  const f=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const st=new Date(s.start),en=new Date(st.getTime()+n0(s.duration||30)*60000);
  const t=isGroup(s)?`${sessTitle(s)} — ${nameOf(s.teacherId)}`:`تسميع: ${nameOf(sessStu(s)[0])} مع ${nameOf(s.teacherId)}`;
  const det=`موعد تسميع — ${cfg().circleName}${s.link?"\nرابط "+platName(s.link)+": "+s.link:""}${s.note?"\n"+s.note:""}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t)}&dates=${f(st)}/${f(en)}&details=${encodeURIComponent(det)}&location=${encodeURIComponent(s.link||"")}`;
}
function sessState(s){const now=Date.now(),st=new Date(s.start).getTime(),en=st+n0(s.duration||30)*60000;if(s.status!=="confirmed")return s.status;if(now>=st-10*60000&&now<=en)return"live";if(now>en)return"past";return"upcoming"}
const SESS_LBL={requested:["بانتظار التأكيد","p-warn"],confirmed:["مؤكد","p-pri"],done:["تم التسميع","p-ok"],cancelled:["ملغى","p-bad"],missed:["لم يحضر","p-bad"]};

/* ============ واجهة عامة ============ */
function toast(msg,kind){const t=$("#toast");t.innerHTML=`<div class="toast ${kind||""}">${esc(msg)}</div>`;clearTimeout(toast._t);toast._t=setTimeout(()=>t.innerHTML="",3800)}
function openModal(title,body,form,ctx,submitLbl="حفظ",extraFoot=""){
  modalCtx=ctx||{};
  setTimeout(()=>{applyPerms($("#modal"));applyReplace($("#modal"))},0);
  $("#modal").innerHTML=`<div class="modal" data-act="backdrop"><form class="dlg" data-form="${form}" autocomplete="off"><div class="dlg-h"><h3>${title}</h3><button type="button" class="btn ghost sm" data-act="close" aria-label="إغلاق">✕</button></div><div class="dlg-b">${body}</div><div class="dlg-f"><button class="btn pri" type="submit">${submitLbl}</button><button type="button" class="btn" data-act="close">إلغاء</button>${extraFoot}</div></form></div>`;
  const f=$("#modal input:not([type=hidden]),#modal select,#modal textarea");if(f&&window.innerWidth>700)f.focus();
}
const closeModal=()=>{$("#modal").innerHTML="";modalCtx=null};
const sel=(name,opts,v,extra="")=>`<select name="${name}" id="f-${name}" ${extra}>${opts.map(([k,l])=>`<option value="${esc(k)}" ${String(k)===String(v??"")?"selected":""}>${esc(l)}</option>`).join("")}</select>`;
const fld=(label,html,hint)=>`<label class="f">${label}${html}${hint?`<span class="hint">${hint}</span>`:""}</label>`;
const inp=(name,v,type="text",extra="")=>`<input name="${name}" id="f-${name}" type="${type}" value="${esc(v??"")}" ${extra}>`;
const surahSel=(name,v)=>sel(name,[["","— اختر السورة —"],...SURAHS.map(s=>[s.n,s.n])],v);
const gradeSel=(name,v)=>sel(name,[["","—"],...[5,4,3,2,1].map(g=>[g,GR[g]])],v);
const empty=(t)=>`<div class="empty">${t}</div>`;
const kindTag=k=>`<span class="kind k-${k}">${KIND[k]||k}</span>`;
const pbar=(v,max)=>{const p=max?Math.min(100,Math.round(v/max*100)):0;return `<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`};

/* ============ الهيكل ============ */
function navFor(m){return orderNav(m,baseNav(m))}
function baseNav(m){
  const c=cfg();
  if(isStaff(m)){const NP={custom:"ui.customize",students:"view.students",circles:"view.students",daily:"daily.log",reports:"reports.view",admin:"admin.dashboard",perms:"perms.manage"};
    return [["home","الرئيسية"],["inbox","الرسائل"],["daily","السجل اليومي"],["students","الطلاب"],["circles","الحلقات"],["sessions","المواعيد"],["programs","البرامج"],["reports","التقارير"],["board","لوحة الشرف"],["mushaf","المصحف"],["zad","زادي"],["admin","لوحة المشرف"],["perms","الهيكل والصلاحيات"],["custom","التخصيص"],...(isPA(m)?[["tenants","مسؤول المنصة"]]:[]),["settings",can(m,"members.manage")||can(m,"settings.manage")?"الإدارة":"حسابي"]].filter(([k])=>!NP[k]||can(m,NP[k]))}
  if(m.role==="student")return[["today","يومي"],["plan","خطتي"],["marks","ملاحظاتي"],["inbox","الرسائل"],["mushaf","المصحف"],["zad","زادي"],["recite","التسميع"],["programs","البرامج"],["sessions","المواعيد"],["record","سجلي"],...(c.leaderboard?[["board","لوحة الشرف"]]:[])];
  if(m.role==="parent")return[["child","أبنائي"],["inbox","الرسائل"],["notes","الملاحظات"],["sessions","المواعيد"],["mushaf","المصحف"],["zad","زادي"]];
  return[];
}
function header(m){
  const c=cfg();
  const nav=m&&m.status==="active"?navFor(m):[];
  if(m&&nav.length&&!nav.some(n=>n[0]===ui.view)&&!["student","report","program","circle","more","profile","marks","notifs","trash","tenants"].includes(ui.view))ui.view=nav[0][0];
  if(isApp(m))return `${MODE==="demo"?demoBar():""}${previewBar()}<header class="top app-top"><div class="wrap"><div class="top-in"><div class="brand">${brand().hideLogo?"":`<img class="logo" src="${logoMark()}" alt="الشعار">`}<div style="min-width:0">${brand().tagline?`<div class="b-par">${esc(brand().tagline)}</div>`:""}<div class="b-name">${esc(c.circleName)}</div><div class="b-sub app-date2">${hijri(new Date())}</div></div></div><div class="row app-acts" style="gap:6px;flex:none">${bellBtn(m)}<button class="btn ghost sm themebtn" data-act="themeToggle" aria-label="${isDark()?"الوضع الفاتح":"الوضع الليلي"}">${isDark()?ICON.sun:ICON.moon}</button>${m?`<button class="avatar-btn ${ui.view==="profile"?"on":""}" data-act="go" data-v="profile" aria-label="ملفي">${avIn(m)}</button>`:""}</div></div>
  <nav class="nav app-nav" aria-label="الأقسام">${nav.map(([k,l])=>`<button data-act="go" data-v="${k}" class="${ui.view===k||(k==="programs"&&ui.view==="program")||(k==="child"&&ui.view==="report")?"on":""}"><span class="ni">${NAVICON[k]||""}</span>${esc(l)}</button>`).join("")}</nav></div></header>`;
  return `${MODE==="demo"?demoBar():""}${previewBar()}<header class="top"><div class="wrap"><div class="top-in"><div class="brand">${brand().hideLogo?"":`<img class="logo" src="${logoMark()}" alt="الشعار">`}<div style="min-width:0">${brand().tagline?`<div class="b-par">${esc(brand().tagline)}</div>`:""}<div class="b-name">${esc(c.circleName)}</div><div class="b-sub app-date2">${hijri(new Date())}</div></div></div><div class="who">${divSwitch(m)}${bellBtn(m)}<button class="btn ghost sm themebtn" data-act="themeToggle" title="${isDark()?"الوضع الفاتح":"الوضع الليلي"}" aria-label="${isDark()?"الوضع الفاتح":"الوضع الليلي"}">${isDark()?ICON.sun:ICON.moon}</button>${m?`<button class="btn ghost sm" data-act="myNav" title="ترتيب قائمتي" aria-label="ترتيب قائمتي">${ICON.gear}</button><button class="who-btn ${ui.view==="profile"?"on":""}" data-act="go" data-v="profile" title="ملفي"><span class="avatar">${avIn(m)}</span><span class="role-pill">${ROLE[m.role]||""}</span><span class="who-n">${esc(m.name)}</span></button>`:""}</div></div>
  ${nav.length?`<nav class="nav" aria-label="الأقسام">${nav.map(([k,l])=>`<button data-act="go" data-v="${k}" class="${ui.view===k||(k==="students"&&ui.view==="student")||(k==="reports"&&ui.view==="report"&&isStaff(m))||(k==="programs"&&ui.view==="program")||(k==="circles"&&ui.view==="circle")?"on":""}">${l}</button>`).join("")}</nav>`:""}</div></header>`;
}
function demoBar(){
  const opts=S.members.filter(x=>x.status==="active").map(x=>[x.id,`${ROLE[x.role]}: ${x.name}${x.track&&x.role==="student"?" ("+TRACK[x.track]+")":""}`]);
  return `<div class="demo-bar"><div class="wrap"><strong>عرض تجريبي</strong><span class="muted">بيانات وهمية للتجربة، لا تُحفظ.</span><label class="row">اعرض بصفة: <select data-change="demoAs" id="demo-as" style="padding:4px 8px;border-radius:8px;border:1px solid var(--line);background:var(--surface)">${opts.map(([k,l])=>`<option value="${k}" ${k===ui.demoAs?"selected":""}>${esc(l)}</option>`).join("")}</select></label><button class="btn sm" data-act="exitDemo">الخروج من التجربة</button></div></div>`;
}

let lastFocus=null;
function render(){if(DRAG){PENDING=true;return}
  const ae=document.activeElement;const fid=ae&&ae.id&&$("#app").contains(ae)?ae.id:null;const pos=fid&&ae.selectionStart!=null?ae.selectionStart:null;
  applyTerms();applyTheme();applyBrandMeta();try{const _m=MODE==="loading"||MODE==="nodb"?null:me();document.body.classList.toggle("app",isApp(_m));document.body.classList.toggle("staff",!!_m&&isStaff(_m)&&_m.status==="active")}catch(e){}
  $("#app").innerHTML=page();applyPerms($("#app"));applyReplace($("#app"));postRender();
  if(fid){const el=document.getElementById(fid);if(el){el.focus();if(pos!=null&&el.setSelectionRange)try{el.setSelectionRange(pos,pos)}catch(e){}}}
}
function page(){
  if(MODE==="loading")return header(null)+`<main class="wrap"><div class="empty">جاري فتح المنصة…</div></main>`;
  if(MODE==="live"&&licLocked())return header(null)+licLockView();
  if(MODE==="nodb")return header(null)+welcome();
  if(MODE==="auth")return header(null)+authView();
  if(MODE==="live"&&READY.size<COLS.length)return header(null)+`<main class="wrap"><div class="empty">${SLOW?"تعذّر الوصول إلى البيانات حتى الآن. تحقق من اتصالك، وستظهر البيانات تلقائياً عند توفرها.":"جاري تحميل بيانات الحلقة…"}</div></main>`;
  const m=me();
  if(!m)return header(null)+register();
  if(m.status!=="active")return header(m)+pending(m);
  const v=ui.view;
  let body="";
  try{
    if(isStaff(m))body=({tenants:tenantsView,trash:trashView,notifs:notifsView,home:staffHome,zad:zadView,students:studentsView,student:()=>studentDetail(ui.sid),daily:dailyView,more:moreView,circles:circlesView,circle:()=>circleDetail(ui.cid),sessions:sessionsView,programs:programsView,program:()=>programDetail(ui.pid),reports:reportsView,report:()=>reportDetail(ui.rsid,true),board:boardView,settings:settingsView,mushaf:mushafView,admin:adminView,perms:permsView,custom:customView,inbox:inboxView,profile:profileView}[v]||staffHome)(m);
    else if(m.role==="student")body=({notifs:notifsView,today:studentToday,zad:zadView,plan:studentPlan,inbox:inboxView,profile:profileView,marks:marksView,recite:reciteView,mushaf:mushafView,programs:programsView,program:()=>programDetail(ui.pid),sessions:sessionsView,record:()=>recordView(m.id),board:boardView,more:moreView}[v]||studentToday)(m);
    else if(m.role==="parent")body=({child:parentView,zad:zadView,notes:parentNotes,notifs:notifsView,more:moreView,mushaf:mushafView,sessions:sessionsView,board:parentView,report:()=>reportDetail(ui.rsid,false),inbox:inboxView,profile:profileView,marks:()=>marksView(m,(m.childIds||[]).includes(ui.kid)?ui.kid:(m.childIds||[])[0])}[v]||parentView)(m);
  }catch(e){console.error(e);body=empty("حدث خطأ في عرض هذه الصفحة: "+esc(e.message))}
  return header(m)+`<main class="wrap">${body}</main>`+(hasDrafts()?`<div class="savebar" role="status"><div class="sb-in"><span><b>لديك تعديلات غير محفوظة</b><small>تظهر لك الآن كمعاينة، ولن تُطبَّق على الجميع حتى تضغط حفظ.</small></span><div class="row"><button class="btn pri" data-act="saveDrafts">حفظ التعديلات</button><button class="btn" data-act="discardDrafts">تراجع</button></div></div></div>`:"")+(isApp(m)?bottomBar(m,"appbar"):isStaff(m)?bottomBar(m,"staffbar"):"");
}

/* ============ الترحيب والتسجيل ============ */
function welcome(){
  return `<main class="wrap"><div class="center-page"><img class="welcome-logo" src="${logoFull()}" alt="${esc(cfg().circleName)}"><h1>منصة متابعة الحلقة</h1><p class="muted">خطط الحفظ والتلاوة، المهام اليومية، السجل والتقديرات، البرامج العلمية، ومواعيد التسميع عن بُعد، مع تقارير شهرية لكل طالب.</p>
  <div class="card"><p>${!(window.APP_CONFIG&&window.APP_CONFIG.supabaseUrl)?"لم يُضبط اتصال قاعدة البيانات بعد: ملف <b>config.js</b> المرفوع فارغ أو قديم. ارفع مجلد <b>public</b> الأخير ثم أعد تحميل الصفحة.":!window.supabase?"تعذّر تحميل مكتبة قاعدة البيانات: الملف <b>vendor/supabase.js</b> غير موجود في الموقع المرفوع. ارفع مجلد <b>public</b> كاملاً.":"تعذّر تهيئة الاتصال بقاعدة البيانات."}</p><p class="hint">رمز التشخيص: ${window.APP_CONFIG&&window.APP_CONFIG.supabaseUrl?"cfg✓":"cfg✗"} · ${window.supabase?"lib✓":"lib✗"}</p></div>
  <div class="row"><button class="btn pri" data-act="demo">جرّب العرض التجريبي</button></div></div></main>`;
}
function register(){
  const first=!S.members.length;
  return `<main class="wrap"><div class="center-page"><img class="welcome-logo" src="${logoFull()}" alt="${esc(cfg().circleName)}"><h1>${OWNER?"إعداد المنصة":"التسجيل في المنصة"}</h1>
  <p class="muted">${OWNER?"أنت أول من يسجّل، وستكون مدير البرنامج. بعدها أرسل رابط الموقع للمعلمين والطلاب وأولياء الأمور ليسجّلوا.":"عبّئ بياناتك فقط. بعد اعتماد تسجيلك يتولى المسؤول عن الحسابات إسنادك إلى حلقتك."}</p>
  <form class="card stack" data-form="register">
  <div class="fg">${fld("الاسم الكامل",inp("name",(USERMETA&&USERMETA.name)||"","text","required"))}${OWNER?"":fld("التسجيل بصفة",sel("role",[["student","طالب"],["teacher","معلم"],["parent","ولي أمر"]],"student",`data-change="regRole"`))}</div>
  ${OWNER?"":`<div id="reg-track" class="stack"><b>اختر برنامجك</b><div class="grid g2" style="gap:10px">
   <label class="track-card"><input type="radio" name="track" value="hifz" checked><span><b>برنامج الحفظ</b><span class="small muted">حفظ جديد يومي مع مراجعة منتظمة، وخطة تصل بك إلى هدفك من الأجزاء.</span></span></label>
   <label class="track-card"><input type="radio" name="track" value="tilawa"><span><b>برنامج التلاوة</b><span class="small muted">تصحيح التلاوة وتطبيق أحكام التجويد، مع متابعة الأخطاء ومقدار القراءة.</span></span></label></div></div>
  <div class="fg">${fld("رقم الجوال",inp("phone",(USERMETA&&USERMETA.phone)||"","tel"))}</div>${fld("ملاحظة للمشرف",`<textarea name="note" id="f-note" placeholder="مثال: ولي أمر الطالب عبدالرحمن، أو المحفوظ السابق"></textarea>`)}`}
  <div class="row"><button class="btn pri">${OWNER?"ابدأ":"إرسال طلب التسجيل"}</button><button class="btn" type="button" data-act="logout">تسجيل الخروج</button></div></form></div></main>`;
}
function pending(m){return `<main class="wrap"><div class="center-page"><h1>طلبك قيد المراجعة</h1><p class="muted">سجّلت باسم «${esc(m.name)}» بصفة ${ROLE[m.role]}. سيظهر لك محتواك فور اعتماد المشرف لتسجيلك.</p><div class="row"><button class="btn" data-act="demo">تصفّح العرض التجريبي</button><button class="btn" data-act="logout">تسجيل الخروج</button></div></div></main>`}

/* ============ المعلم: الرئيسية ============ */
function staffHome(m){
  const st=myStudents(m),d=today();
  const L=S.logs.filter(l=>l.date===d&&st.some(s=>s.id===l.studentId));
  const T=S.tasks.filter(t=>t.date===d&&st.some(s=>s.id===t.studentId));
  const sess=S.sessions.filter(s=>s.start.slice(0,10)===d&&sessStu(s).some(id=>st.some(x=>x.id===id))&&s.status!=="cancelled").sort((a,b)=>a.start<b.start?-1:1);
  const req=S.sessions.filter(s=>s.status==="requested"&&sessStu(s).some(id=>st.some(x=>x.id===id)));
  const pend=S.members.filter(x=>x.status==="pending"&&(can(m,"members.manage")||(can(m,"members.approve")&&x.role==="student")));
  const B={};try{B.zadpray=`<div class="zhw">${zHomeHTML()}</div>`}catch(e){}B.hero=licBanner(m)+`<div class="hero greet pattern"><div>${brand().verse?`<div class="verse">${esc(brand().verse)}</div>`:""}<h1>السلام عليكم، ${esc(firstName(m.name))}</h1><div class="date">${fmtD(d)} · ${hijri(new Date())}</div></div><div class="row"><button class="btn pri" data-act="go" data-v="daily">تسجيل متابعة اليوم</button><button class="btn" data-act="newSession">موعد تسميع</button></div></div>`;
  B.stats=`<div class="stats"><div class="stat"><b>${st.length}</b><span>${isAdmin(m)?"طلاب الحلقة":"طلابي"}</span></div><div class="stat"><b>${L.filter(l=>l.attendance==="present"||l.attendance==="late").length}/${st.length}</b><span>حضور اليوم</span></div><div class="stat"><b>${T.filter(t=>t.done).length}/${T.length}</b><span>مهام اليوم المنجزة</span></div><div class="stat"><b>${sess.length}</b><span>مواعيد اليوم</span></div></div>`;
  B.pending=`${pend.length||req.length?`<div class="card"><div class="card-h"><h2>بانتظار إجراء منك</h2></div><div class="list">
   ${pend.map(x=>`<div class="li"><div class="avatar">${avIn(x)}</div><div class="grow"><div class="t">${esc(x.name)}</div><div class="small muted">طلب تسجيل بصفة ${ROLE[x.role]}${x.track&&x.role==="student"?" · "+TRACK[x.track]:""}${x.note?" · "+esc(x.note):""}</div></div><button class="btn sm pri" data-act="approve" data-id="${x.id}">اعتماد</button></div>`).join("")}
   ${req.map(s=>`<div class="li"><div class="avatar">${esc(initials(nameOf(s.studentId)))}</div><div class="grow"><div class="t">${esc(nameOf(s.studentId))} يطلب موعد تسميع</div><div class="small muted">${fmtDT(s.start)}${s.note?" · "+esc(s.note):""}</div></div><button class="btn sm pri" data-act="editSession" data-id="${s.id}">مراجعة وتأكيد</button></div>`).join("")}
  </div></div>`:""}`;
  B.divs=divOverview(m);B.alerts=staffAlerts(m);B.recits=pendingRecits(m);B.board=topStrip(m,[],"staff");B.challenge=chCard(cfg().challenge,"all","تحدي البرنامج",m)+myCircles(m).map(c=>chCard(c.challenge,c.id,c.name,m)).join("")+(can(m,"settings.manage")&&!(cfg().challenge&&cfg().challenge.title&&today()<=cfg().challenge.to)?`<div class="row"><button class="btn sm" data-act="newChallenge" data-cid="all">إطلاق تحدٍّ للبرنامج كله</button></div>`:can(m,"settings.manage")?`<div class="row"><button class="btn sm ghost" data-act="newChallenge" data-cid="all">تعديل تحدي البرنامج</button></div>`:"");
  B.sessions=`<div class="card"><div class="card-h"><h2>مواعيد اليوم</h2><button class="btn sm" data-act="go" data-v="sessions">كل المواعيد</button></div>${sess.length?`<div class="list">${sess.map(sessRow).join("")}</div>`:empty("لا مواعيد تسميع اليوم.")}</div>`;
  B.students=`<div class="card"><div class="card-h"><h2>حال الطلاب اليوم</h2></div>${st.length?`<div class="list">${st.map(s=>{const l=L.find(x=>x.studentId===s.id);const tt=T.filter(t=>t.studentId===s.id);return `<div class="li clickable" data-act="openStudent" data-id="${s.id}"><div class="avatar">${avIn(s)}</div><div class="grow"><div class="t">${esc(s.name)}</div><div class="small muted">${TRACK[s.track]||""} · المهام ${tt.filter(t=>t.done).length}/${tt.length}</div></div>${l?`<span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]||"مسجّل"}</span>`:`<span class="pill">لم يُسجَّل</span>`}</div>`}).join("")}</div>`:empty(`لا يوجد طلاب بعد. <button class="btn sm" data-act="addStudent">إضافة طالب</button>`)}</div>`;
  homeExtras("staff",m,B);return homeLayout("staff",B);
}

/* ============ الطلاب ============ */
function teacherFilter(m){if(!isAdmin(m))return"";return `<select data-change="teacher" id="tf">${[["all","كل المعلمين"],...teachers().map(t=>[t.id,t.name])].map(([k,l])=>`<option value="${k}" ${ui.teacher===k?"selected":""}>${esc(l)}</option>`).join("")}</select>`}
function studentsView(m){
  let st=scoped(m);
  if(ui.track!=="all")st=st.filter(s=>s.track===ui.track);
  if(ui.q)st=st.filter(s=>s.name.includes(ui.q));
  const mf=monthRange(today().slice(0,7));
  return `<div class="hero"><h1>الطلاب</h1><div class="row"><button class="btn" data-act="bulkPlan">خطة لعدة طلاب</button><button class="btn" data-act="impOpen">استيراد من Excel</button><button class="btn pri" data-act="addStudent">إضافة طالب</button></div></div>
  <div class="toolbar"><input id="q" placeholder="بحث بالاسم" value="${esc(ui.q)}" data-input="q"><select data-change="track" id="trk"><option value="all">كل المسارات</option><option value="hifz" ${ui.track==="hifz"?"selected":""}>${TRACK.hifz}</option><option value="tilawa" ${ui.track==="tilawa"?"selected":""}>${TRACK.tilawa}</option></select>${teacherFilter(m)}${circleFilter(m)}</div>
  ${st.length?groupHTML(st,s=>{const p=s.plan||{};const tot=totalPages(s);const x=stats(s.id,mf[0],mf[1]);return `<div class="card clickable" data-act="openStudent" data-id="${s.id}"><div class="row" style="margin-bottom:10px"><div class="avatar">${avIn(s)}</div><div style="min-width:0;flex:1"><div class="t" style="font-weight:600">${esc(s.name)}</div><div class="small muted">${esc(nameOf(s.teacherId))}</div></div><span class="pill ${s.track==="tilawa"?"p-info":"p-pri"}">${s.track==="tilawa"?"تلاوة":"حفظ"}</span></div>
   <div class="small row between"><span>${s.track==="tilawa"?"المقروء":"المحفوظ"}: <b class="num">${tot}</b> وجه${p.targetPages?` من ${p.targetPages}`:""}</span><span class="muted">${(tot/20).toFixed(1)} جزء</span></div>${pbar(tot,n0(p.targetPages)||604)}
   <div class="small muted row between" style="margin-top:8px"><span>نسبة الحضور: ${x.rate==null?"—":x.rate+"%"}</span><span>${s.uid?"له حساب":"بدون حساب"}</span></div></div>`},"grid g3",c=>c?`<button class="btn sm" data-act="openCircle" data-id="${c.id}">صفحة الحلقة</button>`:""):empty("لا يوجد طلاب مطابقون.")}`;
}

function studentDetail(sid){
  const s=get("members",sid);if(!s)return empty("الطالب غير موجود.");
  const tabs=[["plan","الخطة والخريطة"],["tasks","المهام"],["logs","السجل اليومي"],["marks","ملاحظات التسميع"],["exams","الاختبارات"],["recits","التسميع الصوتي"],["certs","الشهادات"],["sessions","المواعيد"],["programs","البرامج"],["report","التقرير"]];
  let body="";
  if(ui.stab==="plan")body=goalCard(s,false)+(s.track==="tilawa"?khatmaHTML(s,true):"")+juzMapHTML(s,true)+planView(s,true);
  else if(ui.stab==="exams")body=`<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newExam" data-sid="${s.id}">اختبار جديد</button></div>${examsTable(examsOf(s.id),true)}`;
  else if(ui.stab==="recits")body=`<div class="stack">${recitsOf(s.id).map(r=>recitItem(r,true)).join("")||empty("لم يرسل الطالب تسميعاً صوتياً بعد.")}</div>`;
  else if(ui.stab==="certs")body=`<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newCert" data-sid="${s.id}">إصدار شهادة</button></div>${certsList(s.id,true)}`;
  else if(ui.stab==="tasks")body=tasksPanel(s,true);
  else if(ui.stab==="marks")body=marksView(me(),s.id,true);
  else if(ui.stab==="logs")body=logsTable(s,logsOf(s.id).slice(0,60),true);
  else if(ui.stab==="sessions")body=`<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newSession" data-sid="${s.id}">موعد جديد</button></div>${sessList(S.sessions.filter(x=>sessStu(x).includes(s.id)))}`;
  else if(ui.stab==="programs")body=studentPrograms(s,true);
  else body=periodPicker()+reportInner(s.id,curRange(s.id),true);
  return `<div><button class="btn ghost sm" data-act="go" data-v="students">→ رجوع للطلاب</button></div>
  <div class="card"><div class="row between"><div class="row"><div class="avatar" style="width:48px;height:48px;font-size:1.1rem">${avIn(s)}</div><div><h1 style="font-size:1.35rem">${esc(s.name)}</h1><div class="small muted">${TRACK[s.track]||""} · المعلم: ${esc(nameOf(s.teacherId))}${s.phone?" · "+esc(s.phone):""}${s.guardianPhone?" · ولي الأمر: "+esc(s.guardianPhone):""}</div></div></div><div class="row">${can(me(),"students.edit")?photoCtl(s):""}<button class="btn sm" data-act="logFor" data-id="${s.id}">تسجيل اليوم</button>${s.uid?(s.username?`<button class="btn sm" data-act="acctReset" data-id="${s.id}">كلمة مرور جديدة</button>`:""):`<button class="btn sm pri" data-act="acctCreate" data-id="${s.id}">إنشاء حساب دخول</button>`}<button class="btn sm" data-act="editMsgs" data-id="${s.id}">الملاحظات الثابتة</button><button class="btn sm" data-act="editMember" data-id="${s.id}">تعديل البيانات</button></div></div>${s.note?`<p class="small muted" style="margin-top:8px">${esc(s.note)}</p>`:""}
  ${s.msgStudent||s.msgParent?`<div class="grid g2" style="margin-top:12px;gap:10px">${s.msgStudent?`<div class="stat"><span class="pill p-pri">للطالب</span><p style="white-space:pre-wrap;margin-top:4px">${esc(s.msgStudent)}</p></div>`:""}${s.msgParent?`<div class="stat"><span class="pill p-acc">لولي الأمر</span><p style="white-space:pre-wrap;margin-top:4px">${esc(s.msgParent)}</p></div>`:""}</div>`:""}</div>
  ${badgesHTML(s.id)}<div class="subtabs">${tabs.map(([k,l])=>`<button data-act="stab" data-v="${k}" class="${ui.stab===k?"on":""}">${l}</button>`).join("")}</div>${body}`;
}

/* ============ الخطة ============ */
function planView(s,staff){
  const p=s.plan||{};const tot=totalPages(s);const target=n0(p.targetPages)||(s.track==="tilawa"?604:0);
  const isT=s.track==="tilawa";
  if(!s.plan)return `<div class="card">${staff?empty(`لم تُحدَّد خطة لهذا الطالب بعد. <button class="btn sm pri" data-act="editPlan" data-id="${s.id}">إنشاء الخطة</button>`):empty("لم يضع معلمك خطتك بعد.")}</div>`;
  const remain=target?Math.max(0,target-tot):0;
  return `<div class="grid g2"><div class="card"><div class="card-h"><h2>${isT?"خطة التلاوة":"خطة الحفظ"}</h2>${staff?`<button class="btn sm" data-act="editPlan" data-id="${s.id}">تعديل الخطة</button>`:""}</div>
  <div class="stack">${p.goal?`<p><b>الهدف:</b> ${esc(p.goal)}</p>`:""}${goalInfo(s).range?`<p class="small">${esc(goalInfo(s).range)}</p>`:""}${n0(p.nextS)?`<p class="small muted">الموضع التالي للتوزيع: سورة ${SN(n0(p.nextS))} الآية ${n0(p.nextA)||1}</p>`:""}
  <div class="grid g2" style="gap:8px"><div><span class="muted small">الورد اليومي</span><div>${esc(amtTxt(p))}</div></div><div><span class="muted small">الاتجاه</span><div>${esc(p.dir?(p.dir==="up"?"من الناس صعوداً":isT?"من الفاتحة نزولاً":"من البقرة نزولاً"):(p.direction||"—"))}</div></div>${!isT&&p.rev&&p.rev.on?`<div><span class="muted small">خطة المراجعة</span><div>${esc(lnTxt(n0(p.rev.amt)))} يومياً · ${esc(revRangeTxt({s1:n0(p.rev.fS),a1:n0(p.rev.fA)||1,s2:n0(p.rev.tS),a2:n0(p.rev.tA)}))}${(()=>{const e=revEstimate(p.rev);return e&&e.need?` <span class="small muted">· الدورة كل ${e.need} يوم مراجعة</span>`:""})()}</div></div>`:!isT&&p.dailyRev?`<div><span class="muted small">المراجعة اليومية</span><div>${esc(p.dailyRev)}</div></div>`:""}
  <div><span class="muted small">أيام الخطة</span><div>${(p.days||[]).map(d=>DAYS[d]).join("، ")||"—"}</div></div><div><span class="muted small">المدة</span><div class="num">${p.startDate?fmtShort(p.startDate):"—"} ← ${p.endDate?fmtShort(p.endDate):"—"}</div></div>${(()=>{const e=p.unit==="line"?planEstimate(p):null;return e&&!e.loading&&e.fin?`<div><span class="muted small">الانتهاء المتوقع</span><div class="num">${fmtShort(e.fin)}${e.avail!=null&&e.avail<e.need?` <span class="pill p-warn">بعد نهاية المدة</span>`:""}</div></div>`:""})()}</div></div></div>
  <div class="card"><div class="card-h"><h2>التقدم</h2></div><div class="stack"><div class="row between"><span>${isT?"المقروء":"المحفوظ"}</span><b class="num">${tot} / ${target||"—"} وجه</b></div>${pbar(tot,target||604)}
  <div class="stats"><div class="stat"><b>${(tot/20).toFixed(1)}</b><span>جزء تقريباً</span></div><div class="stat"><b>${remain}</b><span>وجه متبقٍّ</span></div><div class="stat"><b>${streak(s.id)}</b><span>أيام متتالية بإنجاز كامل</span></div></div>
  ${staff?`<div class="row"><button class="btn" data-act="genWeek" data-id="${s.id}" data-n="7">مهام الأسبوع من الخطة</button><button class="btn" data-act="genWeek" data-id="${s.id}" data-n="30">مهام شهر</button>${p.endDate?`<button class="btn pri" data-act="genWeek" data-id="${s.id}" data-n="all">توزيع الخطة كاملة</button>`:""}</div><span class="hint">ينشئ مهام ${isT?"التلاوة":"الحفظ"+(p.rev&&p.rev.on?" وخطة المراجعة":" والمراجعة")} للأيام القادمة حسب أيام الحلقة، ويحدد السورة والآيات تلقائياً من الخطة (الاتجاه والورد بالأسطر)، دون تكرار ما هو موجود.</span>`:""}</div></div></div>`+schedCard(s,staff);
}

/* ============ المهام ============ */
function taskItem(t,canToggle,showStudent){
  return `<div class="check ${t.done?"done":""}"><button class="cb ${t.done?"on":""}" ${canToggle?`data-act="toggleTask" data-id="${t.id}"`:"disabled"} aria-label="${t.done?"إلغاء الإنجاز":"تم الإنجاز"}">${t.done?ICON.check:""}</button><div class="grow" style="flex:1;min-width:0"><div class="row">${kindTag(t.kind)}<span class="t" style="font-weight:600">${esc(taskTitle(t))}</span></div>${showStudent?`<div class="small muted">${esc(nameOf(t.studentId))}</div>`:""}${t.details?`<div class="small muted" style="white-space:pre-wrap">${esc(t.details)}</div>`:""}${t.programId&&get("programs",t.programId)?`<div class="small" style="color:var(--accent)">ضمن برنامج: ${esc(get("programs",t.programId).title)}</div>`:""}<div class="row">${t.link?`<a class="btn sm" href="${esc(t.link)}" target="_blank" rel="noopener">فتح الرابط ↗</a>`:""}${t.fileUrl?`<a class="btn sm" href="${esc(t.fileUrl)}" target="_blank" rel="noopener">📎 ${esc(t.fileName||"المرفق")}</a>`:""}</div>${t.done&&t.doneAt?`<div class="small" style="color:var(--ok)">أُنجزت ${fmtT(t.doneAt)}</div>`:""}</div>${canToggle==="staff"?`<button class="btn ghost sm" data-act="editTask" data-id="${t.id}">تعديل</button>`:""}</div>`;
}
function tasksPanel(s,staff){
  const from=addDays(today(),-7),to=addDays(today(),14);
  const T=tasksOf(s.id,from,to).sort((a,b)=>a.date<b.date?-1:1);
  const by={};T.forEach(t=>(by[t.date]=by[t.date]||[]).push(t));
  return `<div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-act="newTask" data-sid="${s.id}">مهمة جديدة</button><button class="btn sm" data-act="genWeek" data-id="${s.id}">مهام الأسبوع من الخطة</button><span class="hint">يعرض من أسبوع مضى إلى أسبوعين قادمين</span></div>
  ${Object.keys(by).length?Object.keys(by).map(d=>`<div class="stack" style="margin-bottom:14px"><h3 class="row">${fmtD(d)}${d===today()?' <span class="pill p-acc">اليوم</span>':""}</h3>${by[d].map(t=>taskItem(t,staff?"staff":true)).join("")}</div>`).join(""):empty("لا مهام في هذه الفترة.")}`;
}

/* ============ السجل ============ */
function logsTable(s,L,staff){
  const c=cfg();const m=me();
  const showG=staff||c.studentSeeGrades,showN=staff||(m.role==="parent"?c.parentSeeNotes:c.studentSeeNotes);
  const isT=s.track==="tilawa";
  if(!L.length)return empty("لا يوجد سجل متابعة بعد.");
  return `<div class="tbl-wrap"><table><thead><tr><th>التاريخ</th><th>الحضور</th><th>المقدار</th>${showG?(isT?"<th>الأخطاء</th><th>التقدير</th>":"<th>تقدير الحفظ</th><th>تقدير المراجعة</th><th>الأخطاء</th>"):""}${showN?"<th>ملاحظات</th>":""}${staff?"<th></th>":""}</tr></thead><tbody>
  ${L.map(l=>`<tr><td class="num">${fmtShort(l.date)}</td><td><span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]||"—"}</span></td><td class="wrapc">${amountTxt(l)}</td>${showG?(isT?`<td class="small">${errShort(l)}</td><td><span class="pill ${gradeCls(l.tGrade)}">${gradeTxt(l.tGrade)}</span></td>`:`<td><span class="pill ${gradeCls(l.newGrade)}">${gradeTxt(l.newGrade)}</span></td><td><span class="pill ${gradeCls(l.revGrade)}">${gradeTxt(l.revGrade)}</span></td><td class="small">${errShort(l)}</td>`):""}${showN?`<td class="wrapc">${notesCell(l,staff?"staff":m.role==="parent"?"parent":"student")}</td>`:""}${staff?`<td><button class="btn ghost sm" data-act="editLog" data-id="${l.id}">تعديل</button></td>`:""}</tr>`).join("")}</tbody></table></div>`;
}
function dailyView(m){
  const st=scoped(m).filter(s=>canAttend(m,s)),d=ui.date;const mode=ui.dmode||"quick";
  const done=st.filter(s=>get("logs",`${s.id}_${d}`)).length;
  const head=`<div class="hero"><div><h1>السجل اليومي</h1><div class="date">${fmtD(d)} · حُضّر ${done} من ${st.length}</div></div><div class="toolbar"><button class="btn sm" data-act="day" data-n="-1">→ اليوم السابق</button><input type="date" id="dd" value="${d}" data-change="date"><button class="btn sm" data-act="day" data-n="1">اليوم التالي ←</button>${teacherFilter(m)}${circleFilter(m)}</div></div>
  <div class="row between"><div class="seg modeseg"><button data-act="dmode" data-v="quick" class="${mode==="quick"?"on":""}">تحضير سريع</button><button data-act="dmode" data-v="detail" class="${mode==="detail"?"on":""}">بطاقات التفاصيل</button></div>${attRestricted(m)?'<span class="pill p-info">صلاحيتك: تحضير حلقتك فقط</span>':""}</div>`;
  if(!st.length)return head+empty(attRestricted(m)?"لا توجد حلقة مسندة إليك للتحضير. اطلب من مدير البرنامج إسنادها إليك.":"لا يوجد طلاب.");
  const H=(c,k)=>{const list=st.filter(s=>(s.circleId&&get("circles",s.circleId)?s.circleId:"none")===k);const done=list.filter(s=>get("logs",`${s.id}_${d}`)).length;return `<span class="pill ${done===list.length?"p-ok":""}">حُضّر ${done}/${list.length}</span>${c&&c.meetLink?`<a class="btn sm meet" href="${esc(c.meetLink)}" target="_blank" rel="noopener">${ICON.video} ${platName(c.meetLink)} الحلقة</a>`:""}<button class="btn sm pri" data-act="attAll" data-v="present" data-cid="${k}">الكل حاضر</button><button class="btn sm" data-act="attAll" data-v="absent" data-cid="${k}">الباقي غائب</button>`};
  if(mode==="quick")return head+`<p class="hint">اضغط حالة كل طالب، أو «الكل حاضر» ثم عدّل الغائبين. «الباقي غائب» يسجّل الغياب لمن لم يُحضَّر بعد.</p>`+groupHTML(st,s=>{const l=get("logs",`${s.id}_${d}`);const has=l&&(l.newSurah||l.tSurah||l.revDesc||n0(l.newPages)||n0(l.tPages)||n0(l.newGrade)||n0(l.tGrade));return `<div class="arow ${l?"is-"+l.attendance:""}"><div class="aname"><b>${esc(s.name)}</b><small>${TRACK[s.track]||""}${has?" · "+gradeTxt(l.newGrade||l.tGrade)+" ✓":""}</small></div><div class="seg">${Object.keys(ATT).map(k=>`<button data-act="att" data-id="${s.id}" data-v="${k}" class="${l&&l.attendance===k?"on-"+k:""}">${ATT[k]}</button>`).join("")}</div><button class="btn ghost sm" data-act="logFor" data-id="${s.id}">${has?"تعديل التفاصيل":"التفاصيل"}</button></div>`},"attlist",H);
  return head+`<p class="hint">اضغط حالة الحضور لتسجيلها مباشرة، ثم «التفاصيل» لتسجيل المقدار والتقدير والأخطاء.</p>`+groupHTML(st,s=>{const l=get("logs",`${s.id}_${d}`);return `<div class="card"><div class="row between"><div class="row" style="min-width:0"><div class="avatar">${avIn(s)}</div><div style="min-width:0"><div style="font-weight:600">${esc(s.name)}</div><div class="small muted">${TRACK[s.track]} · ${esc((s.plan||{})[s.track==="tilawa"?"dailyTilawa":"dailyNew"]||"بدون خطة")}</div></div></div>
  <div class="row"><div class="seg">${Object.keys(ATT).map(k=>`<button data-act="att" data-id="${s.id}" data-v="${k}" class="${l&&l.attendance===k?"on-"+k:""}">${ATT[k]}</button>`).join("")}</div><button class="btn sm pri" data-act="logFor" data-id="${s.id}">التفاصيل</button><button class="btn sm ghost" data-act="mushafFor" data-id="${s.id}" title="فتح المصحف في وضع التسميع">المصحف</button></div></div>
  ${l&&(l.newSurah||l.tSurah||l.revDesc||n0(l.newPages)||n0(l.tPages)||nS(l)||l.noteParent)?`<div class="small" style="margin-top:8px">${amountTxt(l)}${n0(l.newGrade)?` · حفظ: <b>${gradeTxt(l.newGrade)}</b>`:""}${n0(l.revGrade)?` · مراجعة: <b>${gradeTxt(l.revGrade)}</b>`:""}${n0(l.tGrade)?` · أداء: <b>${gradeTxt(l.tGrade)}</b> · ${errShort(l)}`:""}${!n0(l.tGrade)&&errShort(l)!=="—"?` · ${errShort(l)}`:""}${nS(l)?` · للطالب: ${esc(nS(l))}`:""}${l.noteParent?` · لولي الأمر: ${esc(l.noteParent)}`:""}</div>`:""}</div>`},"stack",H);
}
function logForm(sid,d,l){
  const s=get("members",sid);const isT=s.track==="tilawa";l=l||{};
  const body=`<div class="fg">${fld("التاريخ",inp("date",d,"date","required"))}${fld("الحضور",sel("attendance",Object.entries(ATT),l.attendance||"present"))}</div>
  ${isT?`<fieldset><legend>التلاوة</legend><div class="fg">${fld("السورة",surahSel("tSurah",l.tSurah))}${fld("من آية",inp("tFrom",l.tFrom,"number","min=1"))}${fld("إلى آية",inp("tTo",l.tTo,"number","min=1"))}${fld("عدد الأوجه",inp("tPages",l.tPages,"number","min=0 step=0.5"))}</div>
   <div class="fg">${errFields(l)}${fld("تقدير الأداء",gradeSel("tGrade",l.tGrade))}</div>
   <div><div class="small muted" style="margin-bottom:6px">أحكام تحتاج تدريباً</div><div class="chips">${TAJWEED.map(t=>`<label><input type="checkbox" name="tajweed" value="${t}" ${(l.tajweed||[]).includes(t)?"checked":""}>${t}</label>`).join("")}</div></div>
   ${fld("ملاحظات التجويد",`<textarea name="tajweedNote" id="f-tajweedNote">${esc(l.tajweedNote||"")}</textarea>`)}</fieldset>`
  :`<fieldset><legend>الحفظ الجديد</legend><div class="fg">${fld("السورة",surahSel("newSurah",l.newSurah))}${fld("من آية",inp("newFrom",l.newFrom,"number","min=1"))}${fld("إلى آية",inp("newTo",l.newTo,"number","min=1"))}${fld("عدد الأوجه",inp("newPages",l.newPages,"number","min=0 step=0.25"))}${fld("التقدير",gradeSel("newGrade",l.newGrade))}</div><div class="fg">${errFields(l)}</div></fieldset>
   <fieldset><legend>المراجعة</legend><div class="fg">${fld("المقطع",inp("revDesc",l.revDesc,"text","placeholder='مثال: جزء عم أو البقرة 1–40'"))}${fld("عدد الأوجه",inp("revPages",l.revPages,"number","min=0 step=0.5"))}${fld("التقدير",gradeSel("revGrade",l.revGrade))}</div></fieldset>
   <fieldset><legend>التجويد</legend><div class="chips">${TAJWEED.map(t=>`<label><input type="checkbox" name="tajweed" value="${t}" ${(l.tajweed||[]).includes(t)?"checked":""}>${t}</label>`).join("")}</div></fieldset>`}
  <fieldset><legend>الملاحظات</legend>
  ${fld("ملاحظة للطالب",`<textarea name="noteStudent" id="f-noteStudent" placeholder="يراها الطالب في صفحته">${esc(l.id?nS(l):"")}</textarea>`)}
  ${fld("ملاحظة لولي الأمر",`<textarea name="noteParent" id="f-noteParent" placeholder="يراها ولي الأمر فقط، ولا تظهر للطالب">${esc(l.id?nP(l):"")}</textarea>`)}
  ${can(me(),"notes.private")?fld("ملاحظة داخلية",`<textarea name="noteStaff" id="f-noteStaff" placeholder="للمعلمين والمشرف فقط">${esc(l.noteStaff||"")}</textarea>`):""}</fieldset>`;
  openModal(`متابعة: ${esc(s.name)}`,body,"log",{sid},"حفظ المتابعة",l.id?`<button type="button" class="btn danger" data-act="delLog" data-id="${l.id}">حذف</button>`:"");
}

/* ============ المواعيد ============ */
function sessRow(s){
  const st=sessState(s);const[lbl,cls]=st==="live"?["الآن","p-ok"]:SESS_LBL[s.status]||["",""];
  const m=me();const staff=isStaff(m);
  const canJoin=s.link&&s.status==="confirmed"&&st!=="past";
  const grp=isGroup(s);
  return `<div class="li"><div class="avatar" style="${grp?"background:var(--accent-soft);color:var(--accent)":""}">${grp?(sessStu(s).length):esc(initials(staff?sessTitle(s):nameOf(s.teacherId)))}</div><div class="grow"><div class="t">${staff?esc(sessTitle(s)):(grp?esc(sessTitle(s))+" · ":"")+"مع "+esc(nameOf(s.teacherId))}</div><div class="small muted num">${fmtDT(s.start)} · ${n0(s.duration)||30} دقيقة${s.note?" · "+esc(s.note):""}</div></div>
  <span class="pill ${cls}">${lbl}</span>
  <div class="row">${canJoin?`<a class="btn sm meet" href="${esc(s.link)}" target="_blank" rel="noopener">${ICON.video} دخول ${platName(s.link)}</a>`:""}${s.status==="confirmed"?`<a class="btn sm" href="${gcal(s)}" target="_blank" rel="noopener" title="أضف إلى تقويم Google">${ICON.cal} التقويم</a>`:""}${staff&&sessStu(s).length===1?`<button class="btn ghost sm" data-act="mushafFor" data-id="${sessStu(s)[0]}">المصحف</button>`:""}${staff||s.status==="requested"?`<button class="btn ghost sm" data-act="editSession" data-id="${s.id}">${staff?"إدارة":"تعديل"}</button>`:""}</div></div>`;
}
function sessList(arr){
  const now=Date.now()-3*3600000;
  const up=arr.filter(s=>new Date(s.start).getTime()>=now&&s.status!=="cancelled"&&s.status!=="done").sort((a,b)=>a.start<b.start?-1:1);
  const past=arr.filter(s=>!up.includes(s)).sort((a,b)=>a.start<b.start?1:-1).slice(0,30);
  return `<div class="card"><div class="card-h"><h2>القادمة</h2></div>${up.length?`<div class="list">${up.map(sessRow).join("")}</div>`:empty("لا مواعيد قادمة.")}</div>
  <div class="card"><div class="card-h"><h2>السابقة</h2></div>${past.length?`<div class="list">${past.map(sessRow).join("")}</div>`:empty("لا مواعيد سابقة.")}</div>`;
}
function sessionsView(m){
  let arr;
  if(isStaff(m))arr=S.sessions.filter(s=>s.teacherId===m.id||sessStu(s).some(id=>myStudents(m).some(x=>x.id===id)));
  else if(m.role==="student")arr=S.sessions.filter(s=>sessStu(s).includes(m.id));
  else arr=S.sessions.filter(s=>sessStu(s).some(id=>(m.childIds||[]).includes(id)));
  const t=m.role==="student"?teacherOf(m):null;
  return `<div class="hero"><div><h1>مواعيد التسميع</h1><div class="date">${m.role==="parent"?"مواعيد حلقات أبنائك — للاطلاع فقط":"التسميع عن بُعد عبر Google Meet أو Zoom"}</div></div><div class="row">${isStaff(m)?`<button class="btn pri" data-act="newSession">موعد جديد</button>`:m.role==="student"?`<button class="btn pri" data-act="newSession">اطلب موعداً</button>`:""}${m.role==="parent"?"":`<a class="btn" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a>`}</div></div>
  ${m.role==="student"&&t&&t.meetLink?`<div class="next-sess"><div class="grow"><b>رابط حلقة معلمك الثابت</b><div class="small muted">${esc(t.meetLink)}</div></div><a class="btn meet" href="${esc(t.meetLink)}" target="_blank" rel="noopener">${ICON.video} دخول</a></div>`:""}
  ${sessList(arr)}`;
}
function sessionForm(s,presetSid){
  const m=me();const staff=isStaff(m);s=s||{};
  const sid=s.studentId||(s.studentIds||[])[0]||presetSid||(m.role==="student"?m.id:"");
  const kind=s.circleId||presetSid==="__circle"?"circle":(s.studentIds||[]).length>1?"group":"single";
  const pc=s.circleId||modalPresetCircle||"";
  const stu=get("members",sid);const t=stu?teacherOf(stu):(staff?m:null);
  const def=new Date();def.setDate(def.getDate()+1);def.setHours(17,0,0,0);
  const circ=pc?get("circles",pc):null;
  const body=`${staff?`${fld("نوع الموعد",sel("skind",[["single","طالب واحد"],["group","مجموعة طلاب أختارهم"],["circle","حلقة كاملة"]],pc?"circle":kind,`data-change="skind"`))}
  <div id="sk-single" ${(pc?"circle":kind)==="single"?"":"hidden"}>${fld("الطالب",sel("studentId",[["","— اختر —"],...myStudents(m).map(x=>[x.id,x.name])],sid))}</div>
  <div id="sk-group" ${(pc?"circle":kind)==="group"?"":"hidden"}><div class="small muted" style="margin-bottom:6px">اختر الطلاب</div><div class="chips">${myStudents(m).map(x=>`<label><input type="checkbox" name="studentIds" value="${x.id}" ${(s.studentIds||[]).includes(x.id)?"checked":""}>${esc(x.name)}</label>`).join("")}</div></div>
  <div id="sk-circle" ${(pc?"circle":kind)==="circle"?"":"hidden"}>${fld("الحلقة",sel("circleId",[["","— اختر —"],...myCircles(m).map(c=>[c.id,`${c.name} (${circleStudents(c.id).length} طالب)`])],pc),"كل طلاب الحلقة يرون الموعد ورابط الاجتماع، ومن ينضم للحلقة لاحقاً يراه أيضاً.")}</div>`:""}
  <div class="fg">${fld("الموعد",inp("start",s.start?toLocalInput(s.start):toLocalInput(def.toISOString()),"datetime-local","required"))}${fld("المدة (دقيقة)",sel("duration",[[15,"15"],[20,"20"],[30,"30"],[45,"45"],[60,"60"]],s.duration||30))}</div>
  ${staff?`${fld("رابط الاجتماع (Google Meet أو Zoom)",inp("link",s.link||(circ&&circ.meetLink)||(t&&t.meetLink)||(m.meetLink||""),"url","placeholder='https://meet.google.com/xxx-xxxx-xxx'"),"يُملأ تلقائياً برابطك الثابت من «حسابي». لإنشاء رابط جديد: اضغط «إنشاء Meet» أو «إنشاء Zoom» ثم انسخ رابط الاجتماع والصقه هنا.")}
  <div class="row"><a class="btn sm" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn sm" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a>${t&&t.meetLink?"":`<span class="hint">احفظ رابطك الثابت من «حسابي» ليُملأ دائماً.</span>`}</div>
  ${fld("الحالة",sel("status",[["confirmed","مؤكد"],["requested","بانتظار التأكيد"],["done","تم التسميع"],["missed","لم يحضر"],["cancelled","ملغى"]],s.status||"confirmed"))}`:`<p class="hint">سيصل طلبك لمعلمك ليؤكده، وبعد التأكيد يظهر لك زر الدخول إلى الاجتماع وزر الإضافة لتقويم Google.</p>`}
  ${fld("ملاحظة",inp("note",s.note,"text","placeholder='مثال: تسميع سورة الملك كاملة'"))}`;
  openModal(s.id?"إدارة الموعد":staff?"موعد تسميع جديد":"طلب موعد تسميع",body,"session",{id:s.id,sid},staff?"حفظ الموعد":"إرسال الطلب",s.id?`<button type="button" class="btn danger" data-act="delSession" data-id="${s.id}">حذف</button>`:"");
}

/* ============ الحلقات ============ */
const CTRACK={hifz:"حفظ",tilawa:"تلاوة",mixed:"حفظ وتلاوة"};
function circlesView(m){
  const cs=myCircles(m);
  return `<div class="hero"><div><h1>سجل الحلقات</h1><div class="date">كل حلقة بمعلمها وطلابها ومواعيدها ورابط الاجتماع الخاص بها</div></div><button class="btn pri" data-act="newCircle">حلقة جديدة</button></div>
  ${cs.length?`<div class="grid g3">${cs.map(c=>{const st=circleStudents(c.id);const d=today();const pres=st.filter(s=>{const l=get("logs",`${s.id}_${d}`);return l&&(l.attendance==="present"||l.attendance==="late")}).length;const meets=(c.days||[]).includes(dow(d));
   return `<div class="card clickable" data-act="openCircle" data-id="${c.id}"><div class="row between" style="margin-bottom:6px"><span class="pill ${c.track==="tilawa"?"p-info":c.track==="hifz"?"p-pri":"p-acc"}">${CTRACK[c.track]||""}</span>${meets?'<span class="pill p-ok">تنعقد اليوم</span>':""}</div><h3>${esc(c.name)}</h3><div class="small muted">${esc(nameOf(c.teacherId))} · ${st.length} طالب</div><div class="small muted">${schedTxt(c)}</div>${meets?`<div class="small" style="margin-top:6px">حضور اليوم: <b class="num">${pres}/${st.length}</b></div>`:""}</div>`}).join("")}</div>`:empty("لا حلقات بعد. أنشئ حلقة وحدّد معلمها وطلابها وأيامها ورابط الاجتماع الخاص بها.")}
  ${cs.length&&allStudents().some(s=>!s.circleId)&&can(m,"circles.manage")&&isAdmin(m)?`<p class="hint">يوجد ${allStudents().filter(s=>!s.circleId).length} طالب بدون حلقة. أضفهم من «تعديل الحلقة».</p>`:""}`;
}
function circleDetail(cid){
  const c=get("circles",cid);if(!c)return empty("الحلقة غير موجودة.");
  const st=circleStudents(cid);const ids=st.map(s=>s.id);
  const dates=[...new Set(S.logs.filter(l=>ids.includes(l.studentId)).map(l=>l.date))].sort().reverse().slice(0,30);
  const rec=dates.map(d=>{const L=S.logs.filter(l=>l.date===d&&ids.includes(l.studentId));const k={present:0,late:0,absent:0,excused:0};L.forEach(l=>{if(k[l.attendance]!=null)k[l.attendance]++});
    const pages=L.reduce((a,l)=>a+n0(l.newPages)+n0(l.tPages),0);const g=[];L.forEach(l=>[l.newGrade,l.tGrade].forEach(x=>{if(n0(x))g.push(n0(x))}));
    const absent=L.filter(l=>l.attendance==="absent").map(l=>nameOf(l.studentId));
    return {d,k,pages,avg:g.length?g.reduce((a,b)=>a+b,0)/g.length:0,absent,total:st.length}});
  const sess=S.sessions.filter(s=>s.circleId===cid||sessStu(s).some(id=>ids.includes(id)));
  return `<div><button class="btn ghost sm" data-act="go" data-v="circles">→ رجوع للحلقات</button></div>
  <div class="card"><div class="row between"><div><span class="pill ${c.track==="tilawa"?"p-info":"p-pri"}">${CTRACK[c.track]||""}</span><h1 style="margin-top:6px">${esc(c.name)}</h1><div class="small muted">المعلم: ${esc(nameOf(c.teacherId))} · ${schedTxt(c)}</div>${c.description?`<p class="small muted" style="margin-top:6px">${esc(c.description)}</p>`:""}</div>
  <div class="row">${c.meetLink?`<a class="btn meet" href="${esc(c.meetLink)}" target="_blank" rel="noopener">${ICON.video} دخول ${platName(c.meetLink)} الحلقة</a>`:`<a class="btn" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a>`}${hasTime(c)?`<a class="btn" href="${circleCal(c)}" target="_blank" rel="noopener">${ICON.cal} إضافة المواعيد الأسبوعية للتقويم</a>`:""}</div></div>
  <div class="row" style="margin-top:12px"><button class="btn sm pri" data-act="circleDaily" data-id="${c.id}">تحضير وتسجيل اليوم</button><button class="btn sm" data-act="newSession" data-cid="${c.id}" data-sid="__circle">موعد للحلقة</button><button class="btn sm" data-act="editCircle" data-id="${c.id}">تعديل الحلقة والطلاب</button><button class="btn sm" data-act="bulkPlan" data-cid="${c.id}">خطة لطلاب الحلقة</button><button class="btn sm" data-act="newChallenge" data-cid="${c.id}">${c.challenge&&c.challenge.title?"تعديل التحدي":"تحدٍّ للحلقة"}</button></div></div>
  ${chCard(c.challenge,c.id,"تحدي الحلقة",me())}
  <div class="grid g2"><div class="card"><div class="card-h"><h2>الطلاب (${st.length})</h2></div>${st.length?`<div class="list">${st.map(s=>{const l=get("logs",`${s.id}_${today()}`);return `<div class="li clickable" data-act="openStudent" data-id="${s.id}"><div class="avatar">${avIn(s)}</div><div class="grow"><div class="t">${esc(s.name)}</div><div class="small muted">${TRACK[s.track]} · ${totalPages(s)} وجه</div></div>${l?`<span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]||"مسجّل"}</span>`:""}</div>`}).join("")}</div>`:empty("لا طلاب في الحلقة. أضفهم من «تعديل الحلقة والطلاب».")}</div>
  <div class="card"><div class="card-h"><h2>مواعيد الحلقة</h2></div>${(()=>{const up=sess.filter(s=>new Date(s.start).getTime()>=Date.now()-3*3600000&&s.status!=="cancelled").sort((a,b)=>a.start<b.start?-1:1).slice(0,8);return up.length?`<div class="list">${up.map(sessRow).join("")}</div>`:empty("لا مواعيد قادمة.")})()}</div></div>
  <div class="card"><div class="card-h"><h2>سجل لقاءات الحلقة</h2><span class="small muted">آخر 30 لقاءً مسجّلاً</span></div>
  ${rec.length?`<div class="tbl-wrap"><table><thead><tr><th>التاريخ</th><th>حاضر</th><th>متأخر</th><th>غائب</th><th>مستأذن</th><th>نسبة الحضور</th><th>الأوجه</th><th>متوسط التقدير</th><th>الغائبون</th></tr></thead><tbody>${rec.map(r=>{const cnt=r.k.present+r.k.late+r.k.absent;return `<tr class="clickable" data-act="circleDay" data-id="${c.id}" data-d="${r.d}"><td class="num">${fmtShort(r.d)}</td><td class="num">${r.k.present}</td><td class="num">${r.k.late}</td><td class="num">${r.k.absent}</td><td class="num">${r.k.excused}</td><td class="num">${cnt?Math.round((r.k.present+r.k.late)/cnt*100)+"%":"—"}</td><td class="num">${r.pages}</td><td><span class="pill ${gradeCls(r.avg)}">${r.avg?r.avg.toFixed(1):"—"}</span></td><td class="wrapc small">${esc(r.absent.join("، "))||"—"}</td></tr>`}).join("")}</tbody></table></div><p class="hint">اضغط على أي يوم لفتح سجله التفصيلي وتعديله.</p>`:empty("لم يُسجَّل أي لقاء بعد. ابدأ بـ«تحضير وتسجيل اليوم».")}</div>`;
}
/* ============ المراحل والأقسام ============ */
const divs=()=>(cfg().divisions||[]).filter(d=>d&&d.id&&d.name);
const DT=()=>cfg().divTerm||"المرحلة",DTP=()=>cfg().divTermPl||"المراحل";
const divById=id=>divs().find(d=>d.id===id);
const divOfC=c=>(c&&c.divisionId&&divById(c.divisionId))?c.divisionId:"";
function divOfS(s){if(!s)return"";if(s.divisionId&&divById(s.divisionId))return s.divisionId;return divOfC(get("circles",s.circleId))}
function divLock(m){if(!m||m.role==="director"||!divs().length)return null;const L=(m.divisionIds||[]).filter(id=>divById(id));return L.length?L:null}
try{ui.div=localStorage.getItem("divSel")||"all"}catch(e){ui.div="all"}
function curDiv(m){m=m||me();if(!m||!divs().length)return"all";if(!isStaff(m))return m.role==="student"?(divOfS(m)||"all"):"all";
  const L=divLock(m);if(L&&L.length===1)return L[0];const v=ui.div||"all";if(v==="all"||!divById(v)||(L&&!L.includes(v)))return"all";return v}
function divOk(m,id){if(!divs().length||!m||!isStaff(m))return true;const L=divLock(m);if(L&&!L.includes(id))return false;const c=curDiv(m);return c==="all"||c===id}
function staffDivOk(x,m){if(!divs().length||!m||!isStaff(m))return true;const X=(x.divisionIds||[]).filter(id=>divById(id));if(!X.length)return true;const L=divLock(m);const c=curDiv(m);
  if(c!=="all")return X.includes(c);return !L||X.some(id=>L.includes(id))}
function memDivOk(x,m){if(!divs().length||x.status==="pending")return true;if(x.role==="student")return divOk(m,divOfS(x));if(STAFF_ROLES.includes(x.role))return staffDivOk(x,m);
  if(x.role==="parent"){const K=(x.childIds||[]).map(id=>get("members",id)).filter(Boolean);return !K.length||K.some(s=>divOk(m,divOfS(s)))}return true}
const divChoices=m=>{const L=divLock(m);return divs().filter(d=>!L||L.includes(d.id)).map(d=>[d.id,d.name])};
function progDivOk(p,m){const P=(p.divisionIds||[]).filter(id=>divById(id));if(!P.length||!divs().length)return true;const L=divLock(m);const c=curDiv(m);if(c!=="all")return P.includes(c);return !L||P.some(id=>L.includes(id))}
function progForS(p,s){const P=(p.divisionIds||[]).filter(id=>divById(id));if(!P.length||!s)return true;return P.includes(divOfS(s))}
function lbDiv(m){if(!m||isStaff(m)||!divs().length||cfg().boardAllDivs)return"";if(m.role==="student")return divOfS(m);const k=(m.childIds||[]).map(id=>get("members",id)).find(Boolean);return k?divOfS(k):""}
function lbDivOk(m,s){if(!divs().length)return true;if(isStaff(m))return divOk(m,divOfS(s));const d=lbDiv(m);return !d||divOfS(s)===d}
const divDot=d=>`<i class="dv-dot" style="background:${okHex(d&&d.color)?d.color:"var(--primary)"}"></i>`;
function divSwitch(m){if(!m||!isStaff(m)||!divs().length)return"";const L=divLock(m);const ch=divChoices(m);
  if(L&&L.length===1){const d=divById(L[0]);return `<span class="divpill">${divDot(d)}${esc(d.name)}</span>`}
  const c=curDiv(m);return `<label class="divsel">${divDot(divById(c))}<select data-change="divSel" id="div-sel" aria-label="${esc(DT())}"><option value="all" ${c==="all"?"selected":""}>كل ${esc(DTP())}</option>${ch.map(([id,n])=>`<option value="${id}" ${c===id?"selected":""}>${esc(n)}</option>`).join("")}</select></label>`}
function divRows(m,f,t){const st=allStudents().filter(s=>inScope(m,s));const R=divChoices(m).map(([id,n])=>{const ss=st.filter(s=>divOfS(s)===id);const cs=S.circles.filter(c=>divOfC(c)===id);
    const tset=new Set(cs.map(c=>c.teacherId).filter(Boolean));S.members.filter(x=>x.status==="active"&&STAFF_ROLES.includes(x.role)&&(x.divisionIds||[]).includes(id)).forEach(x=>tset.add(x.id));
    return{d:divById(id),ss,cs,tn:tset.size,a:circleAgg(ss.map(s=>s.id),f,t),pn:S.programs.filter(p=>(p.divisionIds||[]).includes(id)).length}});
  const none=st.filter(s=>!divOfS(s));return{R,none}}
function divOverview(m){if(!isStaff(m)||!divs().length||curDiv(m)!=="all"||divChoices(m).length<2)return"";const mo=today().slice(0,7);const[f,t]=monthRange(mo);const{R,none}=divRows(m,f,t);
  return `<section class="card"><div class="card-h"><h2>${esc(DTP())}</h2><span class="small muted">${monthName(mo)} · اضغط لعرض لوحتها</span></div><div class="divgrid">${R.map(r=>`<button class="divcard" data-act="divGo" data-v="${r.d.id}" style="--dc:${okHex(r.d.color)?r.d.color:"var(--primary)"}"><b>${esc(r.d.name)}</b><div class="dv-n"><span><b class="num">${r.ss.length}</b> طالب</span><span><b class="num">${r.cs.length}</b> حلقة</span><span><b class="num">${r.tn}</b> معلم</span></div><div class="small row between"><span class="muted">الحضور</span><b class="num">${r.a.rate==null?"—":r.a.rate+"%"}</b></div>${pbar(r.a.rate||0,100)}</button>`).join("")}</div>${none.length?`<p class="hint" style="margin-top:8px">${none.length} طالب بدون ${esc(DT())}. حدّدها من حلقاتهم أو بياناتهم.</p>`:""}</section>`}
function divCompare(m,f,t){if(!divs().length||curDiv(m)!=="all"||divChoices(m).length<2)return"";const{R}=divRows(m,f,t);
  return `<div class="card"><div class="card-h"><h2>مقارنة ${esc(DTP())}</h2><span class="small muted">${periodLabel([f,t])}</span></div><div class="tbl-wrap"><table><thead><tr><th>${esc(DT())}</th><th>الطلاب</th><th>الحلقات</th><th>المعلمون</th><th>البرامج</th><th style="min-width:150px">الحضور</th><th style="min-width:150px">إنجاز المهام</th><th>حفظ جديد</th><th>تلاوة</th></tr></thead><tbody>
  ${R.map(r=>`<tr class="clickable" data-act="divGo" data-v="${r.d.id}"><td><b>${divDot(r.d)}${esc(r.d.name)}</b></td><td class="num">${r.ss.length}</td><td class="num">${r.cs.length}</td><td class="num">${r.tn}</td><td class="num">${r.pn}</td><td><div class="row" style="flex-wrap:nowrap">${mbar(r.a.rate||0,100)}<span class="num small">${r.a.rate==null?"—":r.a.rate+"%"}</span></div></td><td><div class="row" style="flex-wrap:nowrap">${mbar(r.a.task||0,100)}<span class="num small">${r.a.task==null?"—":r.a.task+"%"}</span></div></td><td class="num">${r.a.newPages!=null?r.a.newPages:"—"}</td><td class="num">${r.a.tPages!=null?r.a.tPages:"—"}</td></tr>`).join("")}</tbody></table></div></div>`}
function divAdminCard(m){const D=divs();const st=allStudents();
  return `<div class="card"><div class="card-h"><h2>${esc(DTP())} والأقسام</h2><button class="btn sm pri" data-act="divNew">إضافة ${esc(DT())}</button></div>
  <p class="hint" style="margin-bottom:10px">قسّم البرنامج إلى ${esc(DTP())} (مثل: ابتدائي، متوسط، ثانوي) أو فروع. لكل ${esc(DT())} لوحة مستقلة بطلابها وحلقاتها ومعلميها وبرامجها، وتتنقّل بينها من القائمة أعلى الصفحة. اربط الحلقة بـ${esc(DT())} من «تعديل الحلقة»، والمعلم من «تعديل البيانات».</p>
  ${D.length?`<div class="list">${D.map(d=>`<div class="li"><span class="dv-sw" style="background:${okHex(d.color)?d.color:"var(--primary)"}"></span><div class="grow"><div class="t">${esc(d.name)}</div><div class="small muted">${st.filter(s=>divOfS(s)===d.id).length} طالب · ${S.circles.filter(c=>divOfC(c)===d.id).length} حلقة${d.desc?" · "+esc(d.desc):""}</div></div><button class="btn sm" data-act="divEdit" data-id="${d.id}">تعديل</button><button class="btn sm ghost danger" data-act="divDel" data-id="${d.id}">حذف</button></div>`).join("")}</div>`:empty(`لا ${esc(DTP())} بعد. البرنامج يعمل كوحدة واحدة حتى تضيفها.`)}
  <div class="fg" style="margin-top:12px">${fld("المسمّى (مفرد)",`<input id="dv-t1" value="${esc(cfg().divTerm||"")}" placeholder="المرحلة" data-change="divTermIn" data-k="divTerm">`,"مثل: المرحلة، الفرع، القسم")}${fld("المسمّى (جمع)",`<input id="dv-t2" value="${esc(cfg().divTermPl||"")}" placeholder="المراحل" data-change="divTermIn" data-k="divTermPl">`)}</div>
  <label class="switch" style="border:0;padding:0"><span>لوحة شرف واحدة لكل ${esc(DTP())} <span class="hint">(إن أُغلق: يرى الطالب ترتيبه داخل ${esc(DT())} فقط)</span></span><input type="checkbox" data-change="cfg" data-k="boardAllDivs" id="cfg-boardAllDivs" ${cfg().boardAllDivs?"checked":""}></label></div>`}
const DIV_COLORS=["#284a70","#2c7a55","#a8862a","#8a3d6b","#217f98","#b0453c","#5b4a9e"];
function divForm(d){d=d||{color:DIV_COLORS[divs().length%DIV_COLORS.length]};
  const body=`${fld("الاسم",inp("name",d.name,"text","required placeholder='مثال: المرحلة الثانوية'"))}<div class="fg">${fld("اللون",`<input type="color" name="color" id="f-color" value="${okHex(d.color)?d.color:"#284a70"}" style="height:42px;padding:4px">`)}${fld("وصف (اختياري)",inp("desc",d.desc,"text","placeholder='مثال: طلاب الصفوف 10–12'"))}</div>`;
  openModal(d.id?`تعديل ${esc(DT())}`:`${esc(DT())} جديدة`,body,"div",{id:d.id},"حفظ")}
/* ============ الهوية (الشعار والاسم) ============ */
const okLogo=v=>typeof v==="string"&&/^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/.test(v);
const logoMark=()=>okLogo(brand().logoMark)?brand().logoMark:LOGO_MARK;
const logoFull=()=>okLogo(brand().logoFull)?brand().logoFull:okLogo(brand().logoMark)?brand().logoMark:LOGO_FULL;
async function fitImg(file,max){const url=URL.createObjectURL(file);try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
  let w=img.naturalWidth||img.width||max,h=img.naturalHeight||img.height||max;const k=Math.min(1,max/Math.max(w,h));w=Math.max(1,Math.round(w*k));h=Math.max(1,Math.round(h*k));
  const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);let u=c.toDataURL("image/png");if(u.length>450000)u=c.toDataURL("image/webp",.9);return u}finally{URL.revokeObjectURL(url)}}
let _brandMetaKey="";
function applyBrandMeta(){try{const n=cfg().circleName||"";const t=brand().tagline;const title=n+(t?" · "+t:"");if(document.title!==title)document.title=title;
  const ic=logoMark();if(ic===_brandMetaKey)return;_brandMetaKey=ic;let l=document.querySelector('link[rel="icon"]');if(!l){l=document.createElement("link");l.rel="icon";document.head.appendChild(l)}l.href=ic;
  let a=document.querySelector('link[rel="apple-touch-icon"]');if(a&&okLogo(brand().logoMark))a.href=ic}catch(e){}}
function brandIdCards(){const b=brand();
  return `<div class="card"><div class="card-h"><h2>الشعار واسم المنصة</h2></div><div class="stack">${fld("اسم المنصة",`<input id="b-name" value="${esc(cfg().circleName)}" data-change="brandName">`,"يظهر أعلى الموقع وفي صفحة الدخول وعنوان المتصفح")}
  <div class="logo-ups">${[["logoMark","الشعار المختصر","للشريط العلوي وأيقونة المتصفح (يفضّل مربعاً)",logoMark()],["logoFull","الشعار الكامل","لصفحة الدخول والشهادات والتقارير",logoFull()]].map(([k,l,h,src])=>`<div class="logo-up"><div class="lu-img"><img src="${src}" alt=""></div><div class="stack" style="gap:4px;min-width:0"><b>${l}</b><span class="hint">${h}</span><div class="row"><label class="btn sm">${b[k]?"تغيير":"رفع شعار"}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-change="logoUp" data-k="${k}" hidden></label>${b[k]?`<button type="button" class="btn sm ghost" data-act="logoDel" data-k="${k}">الشعار الأصلي</button>`:""}</div></div></div>`).join("")}</div>
  <p class="hint">يفضّل PNG بخلفية شفافة. يُحفظ داخل إعدادات المنصة نفسها، فلا حاجة لتعديل ملفات الموقع.</p></div></div>
  <div class="card"><div class="card-h"><h2>نقل الهوية إلى نسخة أخرى</h2></div><p class="small muted" style="margin-bottom:10px">صدّر الهوية كاملة في ملف واحد (الاسم، الشعار، الألوان، الخطوط، المسميات، ترتيب القوائم والصفحة الرئيسية)، ثم استوردها في نسخة جهة أخرى لتطبيقها مباشرة، أو احتفظ بها نسخةً لهويتك.</p>
  <div class="row"><button class="btn sm pri" data-act="idExport">تصدير الهوية</button><label class="btn sm">استيراد هوية<input type="file" accept=".json,application/json" data-change="idImport" hidden></label><button class="btn sm ghost danger" data-act="idReset">استعادة الهوية الافتراضية</button></div></div>`}
/* ============ مركز الإشعارات ============ */
const NIC={msg:"✉",ses:"🗓",task:"✓",log:"✎",rec:"🎙",exam:"★",cert:"🏅",les:"📘",reg:"＋",alert:"!",abs:"!"};
const NCAT={msg:"msgs",ses:"ses",task:"follow",log:"follow",rec:"follow",exam:"follow",cert:"follow",les:"follow",reg:"admin",alert:"admin",abs:"follow"};
function nStore(m,k,v){try{localStorage.setItem(`n-${k}:${m.id}`,JSON.stringify(v))}catch(e){}}
function nGet(m,k,d){try{const v=localStorage.getItem(`n-${k}:${m.id}`);return v==null?d:JSON.parse(v)}catch(e){return d}}
const nRead=m=>new Set(nGet(m,"read",[]));
const nTs=x=>{if(!x)return 0;const t=Date.parse(String(x).length===10?x+"T00:00:00":x);return isNaN(t)?0:t};
function notifFeed(m){if(!m||m.status!=="active")return[];const out=[];const d=today(),from=addDays(d,-14),now=Date.now();const push=o=>{if(o.at&&nTs(o.at)>=nTs(from))out.push(o)};
  msgsOf().filter(x=>x.toId===m.id&&!x.readAt).forEach(x=>push({id:"msg-"+x.id,k:"msg",t:"رسالة من "+nameOf(x.fromId),b:String(x.body||"").slice(0,120),at:x.at||d,v:"inbox"}));
  const isS=m.role==="student",isP=m.role==="parent";
  if(isS||isP){const kids=isS?[m]:parentKids(m);const pre=s=>isP&&kids.length>1?s.name.split(" ")[0]+": ":isP?"ابنك: ":"";
    kids.forEach(s=>{const T=tasksOf(s.id,d,d);const left=T.filter(t=>!t.done).length;if(isS&&left)push({id:"task-"+d,k:"task",t:`وردك اليوم: ${left} ${left===1?"مهمة":"مهام"} لم تُنجز`,b:T.filter(t=>!t.done).map(taskTitle).slice(0,3).join("، "),at:d,v:isS?"today":"child"});
      logsOf(s.id,addDays(d,-7),d).forEach(l=>{const mk=(l.marks||[]).length;const ab=l.attendance==="absent";push({id:"log-"+(l.id||s.id+l.date),k:ab?"abs":"log",t:ab?`${pre(s)}سُجّل غياب`:`${pre(s)}سجّل المعلم متابعة ${l.date===d?"اليوم":fmtD(l.date,{weekday:"long"})}`,b:ab?fmtD(l.date):[ATT[l.attendance]||"",mk?`${mk} ملاحظة على التسميع`:"",amountTxt(l)!=="—"?amountTxt(l):""].filter(Boolean).join(" · "),at:l.date,v:isS?(mk?"marks":"record"):"child"})});
      S.recits.filter(r=>r.studentId===s.id&&r.status==="reviewed").forEach(r=>push({id:"rec-"+r.id,k:"rec",t:`${pre(s)}قُيّم التسميع الصوتي «${r.title||""}»`,b:r.feedback||"",at:r.reviewedAt||r.date,v:isS?"recite":"child"}));
      S.exams.filter(e=>e.studentId===s.id).forEach(e=>push({id:"exam-"+e.id,k:"exam",t:`${pre(s)}نتيجة اختبار ${e.scope||""}`,b:e.score!=null?`الدرجة ${e.score}`:"",at:e.date,v:isS?"record":"child"}));
      S.certs.filter(c=>c.studentId===s.id).forEach(c=>push({id:"cert-"+c.id,k:"cert",t:`${pre(s)}شهادة جديدة: ${c.title||""}`,b:"",at:c.date,v:isS?"record":"child"}))});
    if(isS)visProgs(m).forEach(p=>(p.lessons||[]).filter(l=>l.date&&l.date<=d).forEach(l=>push({id:"les-"+l.id,k:"les",t:`جديد في «${p.title}»`,b:l.title||"",at:l.date,v:"program",x:p.id})))}
  const ids=new Set((isS?[m]:isP?parentKids(m):myStudents(m)).map(s=>s.id));
  S.sessions.filter(s=>s.status==="confirmed"&&s.start&&sessStu(s).some(id=>ids.has(id))&&(!isStaff(m)||s.teacherId===m.id||isAdmin(m))).forEach(s=>{const st=nTs(s.start);if(st>now&&st-now<48*36e5)push({id:"ses-"+s.id,k:"ses",t:isStaff(m)?"موعد: "+sessTitle(s):"موعد تسميع قادم",b:fmtDT(s.start),at:d,v:"sessions"})});
  if(isStaff(m)){S.members.filter(x=>x.status==="pending"&&(can(m,"members.manage")||(can(m,"members.approve")&&x.role==="student"))).forEach(x=>push({id:"reg-"+x.id,k:"reg",t:"طلب تسجيل: "+x.name,b:ROLE[x.role]||"",at:x.joined||d,v:"home"}));
    S.sessions.filter(s=>s.status==="requested"&&sessStu(s).some(id=>ids.has(id))).forEach(s=>push({id:"sreq-"+s.id,k:"ses",t:"طلب موعد: "+nameOf(sessStu(s)[0]),b:fmtDT(s.start),at:d,v:"sessions"}));
    if(can(m,"recits.review"))S.recits.filter(r=>r.status!=="reviewed"&&ids.has(r.studentId)).forEach(r=>push({id:"recq-"+r.id,k:"rec",t:"تسميع صوتي بانتظار تقييمك",b:nameOf(r.studentId)+(r.title?" · "+r.title:""),at:r.createdAt||r.date,v:"student",x:r.studentId,tab:"recits"}));
    alertsFor(myStudents(m)).forEach(a=>push({id:`al-${a.s.id}-${a.k}-${d}`,k:"alert",t:a.s.name,b:a.t,at:d,v:"student",x:a.s.id}))}
  return out.sort((a,b)=>nTs(b.at)-nTs(a.at)||(a.k==="msg"?-1:1))}
function nState(m,F){F=F||notifFeed(m);const R=nRead(m),O=new Set(nGet(m,"open",[]));const un=x=>!R.has(x.id);return{F,un,badge:F.filter(x=>un(x)&&!O.has(x.id)).length}}
function nItem(x,un){return `<button class="nitem ${un?"un":""}" data-act="nGo" data-id="${esc(x.id)}" data-v="${x.v||""}" ${x.x?`data-x="${esc(x.x)}"`:""} ${x.tab?`data-tab="${x.tab}"`:""}><span class="nic n-${x.k}">${NIC[x.k]||"•"}</span><span class="grow" style="min-width:0"><b>${esc(x.t)}</b>${x.b?`<small>${esc(x.b)}</small>`:""}</span><span class="nwhen">${nWhen(x.at)}</span></button>`}
function nWhen(at){const s=String(at||"");const d=s.slice(0,10);if(d===today())return s.length>10?fmtT(s):"اليوم";if(d===addDays(today(),-1))return"أمس";return fmtD(d,{day:"numeric",month:"short"})}
function bellBtn(m){if(!m||m.status!=="active")return"";const S0=nState(m);const n=S0.badge;
  return `<span class="nwrap"><button class="btn ghost sm nbell ${ui.npanel?"on":""}" data-act="nToggle" aria-label="الإشعارات${n?" ("+n+" جديد)":""}" aria-expanded="${!!ui.npanel}">${ICON.bell}${n?`<i class="bellbadge num">${n>9?"9+":n}</i>`:""}</button>${ui.npanel?`<div class="npanel" role="dialog" aria-label="الإشعارات"><div class="np-h"><b>الإشعارات</b>${S0.F.some(S0.un)?`<button class="btn ghost sm" data-act="nAllRead">تحديد الكل كمقروء</button>`:""}</div><div class="np-l">${S0.F.length?S0.F.slice(0,8).map(x=>nItem(x,S0.un(x))).join(""):`<div class="np-e">لا إشعارات جديدة</div>`}</div><button class="np-f" data-act="nAll">عرض كل الإشعارات</button></div>`:""}</span>`}
function notifsView(m){const S0=nState(m);const f=ui.nf||"all";const cats=[["all","الكل"],["un","غير المقروءة"],["msgs","الرسائل"],["ses","المواعيد"],["follow","المتابعة"],...(isStaff(m)?[["admin","الإدارة والتنبيهات"]]:[])];
  const L=S0.F.filter(x=>f==="all"||(f==="un"?S0.un(x):NCAT[x.k]===f));const g={};L.forEach(x=>{const d=String(x.at).slice(0,10);const k=d>=today()?"اليوم":d===addDays(today(),-1)?"أمس":d>=addDays(today(),-7)?"هذا الأسبوع":"أقدم";(g[k]=g[k]||[]).push(x)});
  return `<div class="app-stack"><div class="hero"><div><h1>الإشعارات</h1><div class="date">كل ما يخصك في مكان واحد</div></div>${S0.F.some(S0.un)?`<button class="btn sm" data-act="nAllRead">تحديد الكل كمقروء</button>`:""}</div>
  <div class="subtabs">${cats.map(([k,l])=>{const c=k==="all"?S0.F.length:k==="un"?S0.F.filter(S0.un).length:S0.F.filter(x=>NCAT[x.k]===k).length;return `<button data-act="nFilter" data-v="${k}" class="${f===k?"on":""}">${l}${c?` <span class="num muted">${c}</span>`:""}</button>`}).join("")}</div>
  <section class="card">${L.length?["اليوم","أمس","هذا الأسبوع","أقدم"].filter(k=>g[k]).map(k=>`<div class="ngroup"><div class="small muted ng-h">${k}</div><div class="nlist">${g[k].map(x=>nItem(x,S0.un(x))).join("")}</div></div>`).join(""):empty(f==="un"?"لا إشعارات غير مقروءة.":"لا إشعارات في آخر أسبوعين.")}</section>
  ${notifSupported()?`<section class="card stack"><div class="row between"><b>${ICON.bell} إشعارات الجهاز</b>${notifOn()?`<button class="btn sm" data-act="notifOff">إيقاف</button>`:`<button class="btn sm pri" data-act="notifOn">تفعيل</button>`}</div><span class="hint">${notifOn()?"مفعّلة على هذا الجهاز: تصلك الإشعارات الجديدة ولو كانت المنصة في الخلفية.":"فعّلها لتصلك هذه الإشعارات على جهازك ولو كانت المنصة في الخلفية."}</span>${notifOn()?nPrefsHTML(m):""}</section>`:""}</div>`}
document.addEventListener("click",e=>{if(ui.npanel&&!e.target.closest(".nwrap")){ui.npanel=false;render()}},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&ui.npanel){ui.npanel=false;render()}});
/* ============ جدول الخطة يوماً بيوم ============ */
const PSC={};
function planSchedule(s){const p=s&&s.plan;if(!p||p.unit!=="line"||!n0(p.amt)||!n0(p.gFromS))return null;if(!mqAL()){ensureMQ().then(()=>{if(MQ)render()});return{loading:true}}
  const RV0=s.track!=="tilawa"&&p.rev&&p.rev.on&&n0(p.rev.fS)&&n0(p.rev.amt)?p.rev:null;
  const SF=p.schFrom&&p.schFrom.d&&n0(p.schFrom.s)?p.schFrom:null;const key=JSON.stringify([SF,p.gFromS,p.gFromA,p.gToS,p.gToA,p.amt,p.dir,p.days,p.startDate,p.endDate,RV0&&[RV0.fS,RV0.fA,RV0.tS,RV0.tA,RV0.amt,RV0.days,RV0.dir]]);
  if(PSC[s.id]&&PSC[s.id].key===key)return PSC[s.id];
  const days=p.days&&p.days.length?p.days:[0,1,2,3,4];const up=p.dir?p.dir==="up":n0(p.gFromS)>n0(p.gToS);const gS=n0(p.gToS),gA=n0(p.gToA)||(gS?SURAHS[gS-1].a:0);const amt=n0(p.amt);
  const past=(x,a)=>!!gS&&(up?(x<gS||(x===gS&&a>gA)):(x>gS||(x===gS&&a>gA)));
  let pos=[n0(p.gFromS),n0(p.gFromA)||1];const RV=RV0?{...RV0,nextS:0,nextA:0}:null;let rpos=RV?[n0(RV.fS),n0(RV.fA)||1]:null;const rdays=RV?(RV.days&&RV.days.length?RV.days:days):[];
  const rows=[];let d=p.startDate||today();const end=p.endDate||"";let done=false,n=0,cyc=1;
  let sfApplied=false;
  for(let g=0;g<900;g++){if(SF&&!sfApplied&&d>=SF.d){sfApplied=true;pos=[n0(SF.s),n0(SF.a)||1];done=past(pos[0],pos[1])}if(end&&d>end)break;if(!end&&done)break;const w=dow(d);const e={d,h:[],r:null,rs:SF&&d===SF.d};
    if(!done&&days.includes(w)){let rem=(sfApplied&&n0(SF.amt))?n0(SF.amt):amt,first=true;while(pos&&!past(pos[0],pos[1])&&rem>0.3){const c=chunkLines(pos[0],pos[1],rem,first,gS,gA);if(!c)break;e.h.push(c);rem-=c.ln;first=false;
        if(c.a2<SURAHS[c.s-1].a)pos=[c.s,c.a2+1];else{const ns=up?c.s-1:c.s+1;pos=ns>=1&&ns<=114?[ns,1]:null}}
      if(!pos||past(pos[0],pos[1]))done=true}
    if(RV&&rdays.includes(w)){const c=revChunk(RV,rpos);if(c){e.r={...c,cyc};rpos=c.next;if(c.wrapNext)cyc++}}
    if(e.h.length||e.r){e.n=e.h.length?++n:n;rows.push(e)}d=addDays(d,1)}
  return PSC[s.id]={key,rows,done,last:[...rows].reverse().find(x=>x.h.length)}}
const ayRng=c=>c.a1===c.a2?`سورة ${SN(c.s)} الآية ${c.a1}`:`سورة ${SN(c.s)} من الآية ${c.a1} إلى الآية ${c.a2}`;
function schedDone(s,d){const T=S.tasks.filter(t=>t.studentId===s.id&&t.date===d&&(t.kind==="hifz"||t.kind==="tilawa"));const lg=get("logs",`${s.id}_${d}`);
  if(T.length&&T.every(t=>t.done))return true;return !!(lg&&(lg.newSurah||n0(lg.newPages)||lg.tSurah||n0(lg.tPages)))}
function schedRow(s,e,staff){const t0=today();const isT=s.track==="tilawa";const st=e.d<t0?(e.h.length?(schedDone(s,e.d)?["تم","p-ok"]:["لم يُسجَّل","p-warn"]):null):e.d===t0?["اليوم","p-pri"]:null;
  return `<div class="srow ${e.d===t0?"today":""} ${e.d<t0?"past":""}" ${e.d===t0?'id="sch-today"':""}><div class="sdate"><span>${fmtD(e.d,{weekday:"short"})}</span><b class="num">${fmtD(e.d,{day:"numeric"})}</b><small>${fmtD(e.d,{month:"short"})}</small></div>
  <div class="grow stack" style="gap:4px;min-width:0">${e.h.map(c=>`<div class="sline"><span class="kind k-${isT?"tilawa":"hifz"}">${isT?"تلاوة":"حفظ"}</span><span>${esc(ayRng(c))}</span><span class="small muted num">${esc(lnTxt(Math.max(.5,Math.round(c.ln*2)/2)))}</span></div>`).join("")}
  ${e.r?`<div class="sline"><span class="kind k-murajaa">مراجعة</span><span>${esc(e.r.s1===e.r.s2?ayRng({s:e.r.s1,a1:e.r.a1,a2:e.r.a2}):`من سورة ${SN(e.r.s1)} الآية ${e.r.a1} إلى سورة ${SN(e.r.s2)} الآية ${e.r.a2}`)}</span></div>`:""}</div>
  <div class="sside">${e.h.length?`<span class="small muted num">يوم ${e.n}</span>`:""}${st?`<span class="pill ${st[1]}">${st[0]}</span>`:""}</div></div>`}
function schedCard(s,staff){const P=planSchedule(s);if(!P)return s.plan&&s.plan.unit!=="line"&&staff?`<div class="card"><div class="card-h"><h2>جدول الخطة يوماً بيوم</h2></div><p class="hint">لعرض الجدول بالآيات لكل يوم، افتح «تعديل الخطة» وحدّد الاتجاه والورد اليومي بالأسطر ثم احفظ.</p></div>`:"";
  if(P.loading)return `<div class="card"><div class="card-h"><h2>جدول الخطة يوماً بيوم</h2></div>${empty("جاري حساب الجدول…")}</div>`;
  const t0=today();const mode=ui.sch||"next";const all=P.rows;const isT=s.track==="tilawa";
  let L=mode==="all"?all:mode==="past"?all.filter(e=>e.d<t0).reverse():all.filter(e=>e.d>=t0);const more=mode==="next"&&L.length>14;if(more)L=L.slice(0,14);
  const hd=all.filter(e=>e.h.length);const sfd=(s.plan.schFrom&&s.plan.schFrom.d)||"";const doneN=hd.filter(e=>e.d<t0&&e.d>=sfd&&schedDone(s,e.d)).length,dueN=hd.filter(e=>e.d<t0&&e.d>=sfd).length;
  let wk="";const rows=L.map(e=>{let h="";if(mode!=="past"){const ws=addDays(e.d,-dow(e.d));if(ws!==wk){wk=ws;h=`<div class="sweek">أسبوع ${fmtD(ws,{day:"numeric",month:"long"})}</div>`}}return h+schedRow(s,e,staff)}).join("");
  const behind=dueN-doneN;
  return `<div class="card sched"><div class="card-h"><h2>جدول الخطة يوماً بيوم</h2>${staff&&behind>0?`<button class="btn sm pri" data-act="reschedOpen" data-id="${s.id}">إعادة الجدولة</button>`:""}<div class="seg sm">${[["next","القادمة"],["past","السابقة"],["all","الخطة كاملة"]].map(([k,l])=>`<button data-act="schMode" data-v="${k}" class="${mode===k?"on":""}">${l}</button>`).join("")}</div></div>
  <div class="sched-sum"><span><b class="num">${hd.length}</b> يوم ${isT?"تلاوة":"حفظ"}</span>${P.last?`<span>آخر يوم: <b class="num">${fmtShort(P.last.d)}</b></span>`:""}${dueN?`<span>المنجز حتى الآن: <b class="num">${doneN}/${dueN}</b></span>`:""}${behind>0?`<span class="pill p-warn">متأخر ${behind} ${behind===1?"يوم":"أيام"}</span>`:""}${s.plan.schFrom?`<span class="pill">أُعيدت الجدولة من ${fmtShort(s.plan.schFrom.d)}</span>`:""}${!P.done&&s.plan.endDate?`<span class="pill p-warn">المدة لا تكفي لإتمام النطاق</span>`:""}</div>
  ${L.length?`<div class="slist">${rows}</div>`:empty(mode==="past"?"لم تبدأ الخطة بعد.":"انتهت أيام الخطة.")}${more?`<div class="row" style="justify-content:center;margin-top:10px"><button class="btn sm" data-act="schMode" data-v="all">عرض الخطة كاملة (${all.length} يوماً)</button></div>`:""}</div>`}
function schedDayHTML(m,d,T){const P=planSchedule(m);if(!P||P.loading)return"";const e=P.rows.find(x=>x.d===d);if(!e)return"";
  const has=k=>T.some(t=>t.kind===k);const isT=m.track==="tilawa";const showH=e.h.length&&!has(isT?"tilawa":"hifz"),showR=e.r&&!has("murajaa");if(!showH&&!showR)return"";
  return `<div class="sday"><div class="small muted">مقرر هذا اليوم حسب الخطة${e.h.length?` · يوم ${e.n}`:""}</div>${showH?e.h.map(c=>`<div class="sline"><span class="kind k-${isT?"tilawa":"hifz"}">${isT?"تلاوة":"حفظ"}</span><b>${esc(ayRng(c))}</b>${listenBtn({surah:c.s,fromA:c.a1,toA:c.a2})}</div>`).join(""):""}${showR?`<div class="sline"><span class="kind k-murajaa">مراجعة</span><b>${esc(e.r.s1===e.r.s2?ayRng({s:e.r.s1,a1:e.r.a1,a2:e.r.a2}):`من سورة ${SN(e.r.s1)} ${e.r.a1} إلى سورة ${SN(e.r.s2)} ${e.r.a2}`)}</b></div>`:""}</div>`}
async function genFromSchedule(s,nd){if(!(await ensureMQ())){toast("تعذّر تحميل المصحف لحساب الجدول","err");return}const P=planSchedule(s);if(!P||P.loading){toast("تعذّر حساب الجدول","err");return}const p=s.plan;
  if(nd==="all"){if(!p.endDate&&!P.last){toast("حدد تاريخ نهاية الخطة","err");return}const last=p.endDate||P.rows[P.rows.length-1].d;nd=Math.round((new Date(last)-new Date(today()))/864e5)+1;if(nd<1){toast("انتهت مدة الخطة","err");return}nd=Math.min(nd,800)}
  const kind=s.track==="tilawa"?"tilawa":"hifz",verb=kind==="tilawa"?"تلاوة":"حفظ";const days=p.days&&p.days.length?p.days:[0,1,2,3,4];let n=0;const sid=s.id;
  const has=(d,k)=>S.tasks.some(t=>t.studentId===sid&&t.date===d&&t.kind===k);const add=(d,o)=>{put("tasks","t"+gen(),{studentId:sid,date:d,details:"",done:false,createdBy:me().id,...o});n++};
  for(let i=0;i<nd;i++){const d=addDays(today(),i);const e=P.rows.find(x=>x.d===d);
    if(e&&e.h.length&&!has(d,kind))e.h.forEach(c=>add(d,{kind,title:`${verb} سورة ${SN(c.s)}`,surah:c.s,fromA:c.a1,toA:c.a2,details:`نحو ${lnTxt(Math.max(.5,Math.round(c.ln*2)/2))} · يوم ${e.n} من الخطة`}));
    if(e&&e.r&&!has(d,"murajaa"))add(d,{kind:"murajaa",title:"مراجعة "+revRangeTxt(e.r),details:`نحو ${lnTxt(Math.max(.5,Math.round(e.r.ln*2)/2))}`,...(e.r.s1===e.r.s2?{surah:e.r.s1,fromA:e.r.a1,toA:e.r.a2}:{})});
    else if(!e?.r&&kind==="hifz"&&!(p.rev&&p.rev.on)&&p.dailyRev&&days.includes(dow(d))&&(!p.startDate||d>=p.startDate)&&(!p.endDate||d<=p.endDate)&&!has(d,"murajaa"))add(d,{kind:"murajaa",title:"مراجعة "+p.dailyRev})}
  toast(n?`أُنشئت ${n} مهمة من جدول الخطة`:"المهام موجودة مسبقاً")}
/* ============ سلة المحذوفات ============ */
const TRASH_COLS={members:"عضو",tasks:"مهمة",logs:"سجل متابعة",sessions:"موعد",programs:"برنامج",circles:"حلقة",exams:"اختبار",certs:"شهادة",recits:"تسميع صوتي",messages:"رسالة"};
const TR={mem:[],list:null,loading:false};
function trashAdd(c,id,data){if(!data||!TRASH_COLS[c])return;const e={key:c+"__"+id+"__"+Date.now(),c,id,data:{...data},at:new Date().toISOString(),by:(me()||{}).id||""};delete e.data.id;TR.mem.unshift(e);trashRemoteAdd(e)}
function trashTitle(e){const d=e.data||{};if(e.c==="members")return `${d.name||"—"} (${ROLE[d.role]||""})`;if(e.c==="logs")return `${nameOf(d.studentId)} · ${d.date?fmtD(d.date):""}`;
  if(e.c==="tasks")return `${d.title||"مهمة"} · ${nameOf(d.studentId)}${d.date?" · "+fmtShort(d.date):""}`;if(e.c==="sessions")return `${d.start?fmtDT(d.start):"موعد"}`;if(e.c==="messages")return `${nameOf(d.fromId)} ← ${nameOf(d.toId)}: ${String(d.body||"").slice(0,60)}`;
  if(e.c==="exams")return `${nameOf(d.studentId)} · ${d.scope||""}`;if(e.c==="certs")return `${nameOf(d.studentId)} · ${d.title||""}`;if(e.c==="recits")return `${nameOf(d.studentId)} · ${d.title||""}`;return d.name||d.title||e.id}
function trashItems(){const lim=Date.now()-30*864e5;const seen=new Set();return [...TR.mem,...(TR.list||[])].filter(e=>{if(Date.parse(e.at)<lim||seen.has(e.c+"/"+e.id))return false;seen.add(e.c+"/"+e.id);return !get(e.c,e.id)}).sort((a,b)=>a.at<b.at?1:-1)}
function trashView(m){if(!can(m,"perms.manage"))return empty("سلة المحذوفات لمدير البرنامج فقط.");if(TR.list===null&&!TR.loading)trashLoad();
  const f=ui.trf||"all";const all=trashItems();const L=all.filter(e=>f==="all"||e.c===f);const cats=Object.entries(TRASH_COLS).filter(([k])=>all.some(e=>e.c===k));
  return `<div class="hero"><div><h1>سلة المحذوفات</h1><div class="date">كل ما حُذف خلال آخر 30 يوماً، ويمكن استرجاعه كما كان</div></div><button class="btn sm" data-act="go" data-v="settings">رجوع للإدارة</button></div>
  ${cats.length>1?`<div class="subtabs"><button data-act="trF" data-v="all" class="${f==="all"?"on":""}">الكل <span class="num muted">${all.length}</span></button>${cats.map(([k,l])=>`<button data-act="trF" data-v="${k}" class="${f===k?"on":""}">${l} <span class="num muted">${all.filter(e=>e.c===k).length}</span></button>`).join("")}</div>`:""}
  <div class="card">${TR.loading&&!L.length?empty("جاري التحميل…"):L.length?`<div class="list">${L.map(e=>`<div class="li"><span class="pill">${TRASH_COLS[e.c]}</span><div class="grow" style="min-width:0"><div class="t">${esc(trashTitle(e))}</div><div class="small muted">حُذف ${nWhen(e.at)}${e.by&&get("members",e.by)?" · بواسطة "+esc(nameOf(e.by)):""} · يبقى ${Math.max(1,30-Math.floor((Date.now()-Date.parse(e.at))/864e5))} يوماً</div></div><button class="btn sm pri" data-act="trRestore" data-k="${esc(e.key)}">استرجاع</button></div>`).join("")}</div>`:empty("السلة فارغة.")}</div>
  <p class="hint">الطالب المسترجَع يعود بخطته وبياناته. سجلاته ومهامه المحذوفة معه تظهر هنا أيضاً ويمكن استرجاعها.</p>`}
function trashRestore(key){const e=trashItems().find(x=>x.key===key);if(!e)return;if(get(e.c,e.id)){toast("العنصر موجود بالفعل");return}put(e.c,e.id,e.data);TR.mem=TR.mem.filter(x=>x.key!==key);if(TR.list)TR.list=TR.list.filter(x=>x.key!==key);trashRemoteDone(e);toast("استُرجع: "+trashTitle(e))}
function trashRemoteAdd(e){}
function trashRemoteDone(e){}
async function trashLoad(){if(MODE!=="live"||typeof SB==="undefined"||!SB){TR.list=[];return}TR.loading=true;
  try{const since=new Date(Date.now()-30*864e5).toISOString();const{data,error}=await SB.from("audit_log").select("id,at,actor,table_name,row_id,old_data").eq("action","delete").gte("at",since).order("at",{ascending:false}).limit(500);
    const byUid=new Map(S.members.filter(x=>x.uid).map(x=>[x.uid,x.id]));
    TR.list=error?[]:(data||[]).filter(r=>TRASH_COLS[r.table_name]&&r.old_data).map(r=>({key:"a"+r.id,c:r.table_name,id:r.row_id,data:r.old_data,at:r.at,by:byUid.get(r.actor)||""}))}catch(err){TR.list=[]}TR.loading=false;render()}
/* ============ قوالب الخطط ============ */
const tplList=()=>((get("config","plantpl")||{}).items||[]).filter(t=>t&&t.id&&t.name);
function tplFill(f,t){const set=(k,v)=>{const x=f.querySelector(`[name="${k}"]`);if(x&&v!=null)x.value=v};
  const r=f.querySelector(`input[name="dir"][value="${t.dir}"]`);if(r)r.checked=true;set("gFromS",t.gFromS);set("gFromA",t.gFromA);set("gToS",t.gToS);set("gToA",t.gToA);set("amtN",t.amtN||t.amt);set("amtU",t.amtU||"line");
  f.querySelectorAll('input[name="days"]').forEach(x=>x.checked=(t.days||[]).includes(+x.value));if(t.goal)set("goal",t.goal);
  if(t.dur){const sd=f.querySelector('[name="startDate"]').value||today();set("endDate",addDays(sd,t.dur))}
  const ro=f.querySelector('[name="revOn"]');if(ro){ro.checked=!!t.rev;if(t.rev){const rr=f.querySelector(`input[name="revDir"][value="${t.rev.dir}"]`);if(rr)rr.checked=true;set("rFromS",t.rev.fS);set("rFromA",t.rev.fA);set("rToS",t.rev.tS);set("rToA",t.rev.tA);set("revN",t.rev.n);set("revU",t.rev.u);f.querySelectorAll('input[name="revDays"]').forEach(x=>x.checked=(t.rev.days||[]).includes(+x.value))}}
  f.querySelectorAll(".chip-b").forEach(b=>b.classList.remove("on"));planEstUpd();toast("طُبّق القالب، راجع الحقول ثم احفظ")}
function tplDesc(t){return [t.dir==="up"?"صعوداً":"نزولاً",`${SN(t.gFromS)} ← ${SN(t.gToS)}`,lnTxt(n0(t.amt))+" يومياً",(t.days||[]).length+" أيام في الأسبوع",t.dur?`${Math.round(t.dur/7)} أسبوعاً`:"",t.rev?"مع مراجعة":""].filter(Boolean).join(" · ")}
function bulkPlanForm(cid){const m=me();const T=tplList();loadMushaf();
  if(!T.length){openModal("خطة لعدة طلاب",`<p>لا توجد قوالب بعد.</p><p class="hint">افتح خطة أي طالب، واضبط الاتجاه والورد والمدة، ثم من أسفل النموذج اختر «حفظ هذه الإعدادات كقالب». بعدها تطبّقها هنا على من تريد دفعة واحدة.</p>`,"noop",{},"حسناً");return}
  const pool=scoped(m);const pre=new Set(cid?circleStudents(cid).map(s=>s.id):[]);
  const body=`<div id="bp-tpls" class="stack" style="gap:6px">${T.map((t,i)=>`<label class="tplopt"><input type="radio" name="tpl" value="${t.id}" ${i===0?"checked":""} data-dur="${n0(t.dur)}"><span class="grow"><b>${esc(t.name)}</b><small>${esc(tplDesc(t))}${t.track?" · "+TRACK[t.track]:""}</small></span><button type="button" class="btn ghost sm danger" data-act="tplDel" data-id="${t.id}" aria-label="حذف القالب">حذف</button></label>`).join("")}</div>
  <div class="fg" style="margin-top:12px">${fld("بداية الخطة",inp("startDate",today(),"date","required"))}${fld("نهاية الخطة",inp("endDate",T[0].dur?addDays(today(),T[0].dur):"","date"),"تُحسب من مدة القالب، ويمكن تعديلها")}</div>
  <fieldset><legend>الطلاب</legend><label class="switch" style="border:0;padding:0"><span>تحديد الكل</span><input type="checkbox" id="bp-all" data-change="bpAll" ${pre.size&&pre.size===pool.length?"checked":""}></label><div class="chips">${pool.map(s=>`<label><input type="checkbox" name="sids" value="${s.id}" ${pre.has(s.id)?"checked":""}>${esc(s.name)}${s.plan&&s.plan.unit==="line"?' <span class="hint">(له خطة)</span>':""}</label>`).join("")}</div></fieldset>
  <p class="hint">تُستبدل خطة كل طالب تختاره بخطة القالب. ولا تُحذف مهامه السابقة.</p>`;
  openModal("تطبيق خطة على عدة طلاب",body,"bulkPlan",{cid},"تطبيق الخطة")}
/* ============ إعادة الجدولة ============ */
function reschedForm(s){const P=planSchedule(s);if(!P||P.loading){toast("جاري حساب الجدول، حاول بعد لحظة");return}const p=s.plan;const t0=today();
  const sfd=(p.schFrom&&p.schFrom.d)||"";const due=P.rows.filter(e=>e.d<t0&&e.d>=sfd&&e.h.length);const firstMiss=due.find(e=>!schedDone(s,e.d));const behind=due.filter(e=>!schedDone(s,e.d)).length;
  const at=firstMiss?firstMiss.h[0]:(P.rows.find(e=>e.d>=t0&&e.h.length)||{h:[]}).h[0];if(!at){toast("لا يوجد ما يُعاد جدولته");return}const pos=[at.s,at.a1];
  const gS=n0(p.gToS),gA=n0(p.gToA)||SURAHS[gS-1].a;const rem=rangeLines(pos[0],pos[1],gS,gA);const days=p.days&&p.days.length?p.days:[0,1,2,3,4];
  const avail=p.endDate?sessionsBetween(t0,p.endDate,days):0;const cur=n0(p.amt);const fit=avail?Math.max(cur,Math.ceil(rem/avail*2)/2):0;const finCur=finishDate(t0,days,Math.ceil(rem/cur-0.05));
  const body=`<div class="pe-g" style="margin-bottom:12px"><div><span>متأخر</span><b class="num">${behind}</b><small>${behind===1?"يوم":"أيام"} لم تُسجَّل</small></div><div><span>يبدأ من</span><b>${esc(SN(pos[0]))}</b><small class="num">الآية ${pos[1]}</small></div><div><span>المتبقي</span><b class="num">${Math.round(rem)}</b><small>سطراً</small></div></div>
  ${fld("تبدأ الجدولة الجديدة من",inp("d",t0,"date","required"))}
  <div class="stack" style="gap:6px"><label class="tplopt"><input type="radio" name="mode" value="keep" ${!fit||fit===cur?"checked":""}><span class="grow"><b>أبقِ الورد ${esc(lnTxt(cur))} يومياً</b><small>${finCur?"ينتهي في "+fmtShort(finCur):""}${p.endDate&&finCur&&finCur>p.endDate?" · بعد نهاية المدة":""}</small></span></label>
  ${fit&&fit>cur?`<label class="tplopt"><input type="radio" name="mode" value="fit" checked><span class="grow"><b>زِد الورد إلى ${esc(lnTxt(fit))} يومياً</b><small>لينتهي في موعده ${fmtShort(p.endDate)}</small></span></label>`:""}</div>
  <label class="switch" style="border:0;padding:0;margin-top:10px"><span>حذف مهام الحفظ القادمة غير المنجزة، وإنشاء مهام الأسبوع من الجدول الجديد</span><input type="checkbox" name="clear" checked></label>
  <p class="hint">الأيام السابقة تبقى في السجل كما هي، والجدول الجديد يبدأ من أول موضع لم يُنجز.</p>`;
  openModal(`إعادة جدولة خطة ${esc(s.name)}`,body,"resched",{sid:s.id,pos,fit},"اعتماد الجدولة")}
/* ============ خريطة الأخطاء على المصحف ============ */
let HEATM=null;const HEATC={};
function heatMap(sid){const L=logsOf(sid).filter(l=>(l.marks||[]).length);const key=sid+"|"+L.map(l=>l.date+l.marks.length).join(",");if(HEATC[sid]&&HEATC[sid].key===key)return HEATC[sid].m;
  const M={};L.forEach(l=>l.marks.forEach(x=>{const k=x.g+":"+x.w;const o=M[k]||(M[k]={n:0,t:0,l:0,last:"",g:x.g,w:x.w,word:x.word,c:null});o.n++;o[MT(x.t)]++;if(l.date>=o.last){o.last=l.date;o.lt=MT(x.t);if(x.c!=null)o.c=x.c}}));HEATC[sid]={key,m:M};return M}
const pgOfG=g=>Q?pageOf(g):1;
function heatPages(M){const P={};Object.values(M).forEach(o=>{const p=pgOfG(o.g);P[p]=(P[p]||0)+o.n});return Object.entries(P).map(([p,n])=>[+p,n]).sort((a,b)=>b[1]-a[1])}
function heatAllowed(m,sid){if(!m)return false;if(isStaff(m))return true;if(m.role==="student")return sid===m.id;if(m.role==="parent")return (m.childIds||[]).includes(sid);return false}
function heatSpan(k,ch,ff){const o=HEATM&&HEATM[k];if(!o)return ff?"":`<span>${ch}</span>`;const tt=[o.t?`تنبيه ×${o.t}`:"",o.l?`تلقين ×${o.l}`:""].filter(Boolean).join(" · ")+(o.last?` · آخرها ${fmtShort(o.last)}`:"");
  let inner=ch;if(!ff&&o.c!=null){try{const cl=CLUS(ch);inner=cl.map((x,i)=>i===o.c?`<span class="mc">${x}</span>`:x).join("")}catch(e){}}
  return `<span class="w hw ${o.l?MK.l[1]:MK.t[1]}" ${o.n>1?`data-n="${o.n}"`:""} ${ff?`style="${ff}"`:""} title="${esc(tt)}">${inner}</span>`}
function heatBar(m,pg,tm){const opts=m.role==="student"?[[m.id,"أخطائي"]]:m.role==="parent"?parentKids(m).map(s=>[s.id,s.name]):isStaff(m)?myStudents(m).filter(s=>logsOf(s.id).some(l=>(l.marks||[]).length)).map(s=>[s.id,s.name]):[];if(!opts.length)return"";
  const on=ui.mheat&&heatAllowed(m,ui.mheat)&&!tm;let extra="";
  if(on){const M=HEATM||heatMap(ui.mheat);const P=heatPages(M);const here=(P.find(x=>x[0]===pg)||[0,0])[1];const words=Object.keys(M).length;
    extra=`<div class="hb-l"><span class="mlegend mt-t"><span class="dot"></span>تنبيه</span><span class="mlegend mt-l"><span class="dot"></span>تلقين</span><span class="small muted">الرقم الصغير = عدد مرات تكرار الملاحظة على الكلمة · في هذه الصفحة <b class="num">${here}</b> · في المصحف <b class="num">${words}</b> موضعاً</span></div>
    ${P.length?`<div class="hb-p"><span class="small muted">الصفحات الأكثر أخطاء:</span>${P.slice(0,8).map(([p,n])=>`<button class="chip-b ${p===pg?"on":""}" data-act="mPageGo" data-v="${p}">ص ${p} <span class="num">(${n})</span></button>`).join("")}</div>`:empty("لا أخطاء مسجّلة بعد.")}`}
  return `<div class="card heatbar ${on?"on":""}"><div class="row between" style="gap:8px;flex-wrap:wrap"><b>خريطة الأخطاء على المصحف</b>${m.role==="student"?(on?`<button class="btn sm" data-act="heatOff">إخفاء</button>`:`<button class="btn sm pri" data-act="heatGo" data-id="${m.id}">أظهر أخطائي</button>`):`<select id="m-heat" data-change="mHeat" style="max-width:220px"><option value="">— إيقاف —</option>${opts.map(([id,n])=>`<option value="${id}" ${ui.mheat===id?"selected":""}>${esc(n)}</option>`).join("")}</select>`}</div>${tm&&ui.mheat?`<p class="hint" style="margin-top:6px">تُخفى الخريطة أثناء وضع التسميع.</p>`:""}${extra}</div>`}
/* ============ التقرير الشهري (إضافات) ============ */
function reportTables(d){const s=d.s;const T=[];const m=me();
  if(s.plan){const g=goalInfo(s);const P=planSchedule(s);const t0=today();const p=s.plan;const sfd=(p.schFrom&&p.schFrom.d)||"";
    const due=P&&!P.loading?P.rows.filter(e=>e.h.length&&e.d<t0&&e.d>=sfd):[];const late=due.filter(e=>!schedDone(s,e.d)).length;
    const rows=[[p.goal||"—",g.range||"—",g.pct==null?"—":g.pct+"%",g.tp==null?"—":g.tp+"%",p.unit==="line"?lnTxt(n0(p.amt)):amtTxt(p),P&&!P.loading?String(late):"—",p.rev&&p.rev.on?lnTxt(n0(p.rev.amt)):"—"]];
    T.push({title:"الهدف والخطة",head:["الهدف","النطاق","نسبة الإنجاز","الوقت المنقضي","الورد اليومي","أيام متأخرة","المراجعة اليومية"],rows});
    if(P&&!P.loading){const nx=P.rows.filter(e=>e.d>=t0).slice(0,7);if(nx.length)T.push({title:"مقرر الأيام القادمة",head:["التاريخ","الحفظ / التلاوة","المراجعة"],rows:nx.map(e=>[fmtD(e.d,{weekday:"long",day:"numeric",month:"long"}),e.h.map(ayRng).join(" + ")||"—",e.r?revRangeTxt(e.r):"—"]),maxW:{1:700,2:620}})}}
  const H=heatMap(s.id);const top=Object.values(H).filter(o=>o.n>1).sort((a,b)=>b.n-a.n).slice(0,10);
  if(top.length&&(isStaff(m)||cfg().studentSeeNotes))T.push({title:"مواضع تكررت فيها الملاحظات",head:["الكلمة","الموضع","المرات","تنبيه","تلقين","آخرها"],rows:top.map(o=>{const[si,a]=Q?sa(o.g):[0,0];return[o.word||wtext(o.g,o.w)||"—",Q?`${Q.s[si][0]} ${a}`:"",o.n,o.t,o.l,o.last?fmtShort(o.last):""]})});
  if(d.er.length)T.push({title:"الاختبارات",head:d.eh,rows:d.er});T.push({title:"سجل المتابعة",head:d.head,rows:d.rows,maxW:{2:520}});return T}
/* ============ العمل بدون إنترنت ============ */
const OFF={on:false,q:[],flushing:false};
const isNetErr=e=>!navigator.onLine||/Failed to fetch|NetworkError|network|Load failed|fetch failed/i.test(String((e&&(e.message||e.code))||e||""));
const offKey=()=>"outbox:"+(UID||"x");
function offSaveQueue(){try{localStorage.setItem(offKey(),JSON.stringify(OFF.q))}catch(e){toast("مساحة الجهاز لا تكفي لحفظ التعديلات","err")}}
function offLoadQueue(){try{OFF.q=JSON.parse(localStorage.getItem(offKey())||"[]")||[]}catch(e){OFF.q=[]}if(OFF.q.length&&navigator.onLine)setTimeout(offFlush,1500)}
function offQueue(op,c,id,data){const isNew=op==="put"?!(RAW[c]&&RAW[c].has(id))||OFF.q.some(x=>x.c===c&&x.id===id&&x.isNew):false;
  const i=OFF.q.findIndex(x=>x.c===c&&x.id===id);const prevNew=i>=0&&OFF.q[i].isNew;if(i>=0)OFF.q.splice(i,1);
  if(op==="del"&&prevNew){}else OFF.q.push({op,c,id,data:data||null,isNew:isNew||prevNew,at:Date.now()});
  if(RAW[c]){if(op==="put")RAW[c].set(id,{id,data});else RAW[c].delete(id)}
  offSaveQueue();OFF.on=OFF.on||!navigator.onLine;offBar();snapSaveSoon()}
function offApplyQueueToRaw(){OFF.q.forEach(x=>{if(!RAW[x.c])return;if(x.op==="put")RAW[x.c].set(x.id,{id:x.id,data:x.data});else RAW[x.c].delete(x.id)})}
async function offFlush(){if(OFF.flushing||!OFF.q.length||!navigator.onLine||!SB||MODE!=="live")return;OFF.flushing=true;offBar();let ok=0,bad=0;
  while(OFF.q.length){const x=OFF.q[0];try{if(x.op==="put"){if(x.isNew&&RAW[x.c]){const keep=RAW[x.c].get(x.id);RAW[x.c].delete(x.id);try{await remotePut(x.c,x.id,x.data)}finally{if(keep)RAW[x.c].set(x.id,keep)}}else await remotePut(x.c,x.id,x.data)}else await remoteDel(x.c,x.id);ok++}
    catch(e){if(isNetErr(e))break;console.error(e);bad++}OFF.q.shift();offSaveQueue()}
  OFF.flushing=false;if(!OFF.q.length){OFF.on=false;await reloadAll();toast(bad?`رُفعت ${ok} تعديلات، وتعذّر رفع ${bad} لعدم الصلاحية`:`عاد الاتصال ورُفعت ${ok} ${ok===1?"تعديل":"تعديلات"} محفوظة`,bad?"err":undefined)}offBar()}
function offBar(){let el=document.getElementById("offbar");const n=OFF.q.length;const show=MODE==="live"&&(OFF.on||!navigator.onLine||n);
  if(!show){if(el)el.remove();return}if(!el){el=document.createElement("div");el.id="offbar";el.setAttribute("role","status");document.body.appendChild(el)}
  el.className=navigator.onLine&&!OFF.on?"sync":"off";el.textContent=OFF.flushing?`جاري رفع ${n} ${n===1?"تعديل":"تعديلات"}…`:(!navigator.onLine||OFF.on)?`غير متصل بالإنترنت${n?` · ${n} ${n===1?"تعديل محفوظ":"تعديلات محفوظة"} على جهازك وتُرفع تلقائياً عند عودة الاتصال`:" · تعرض المنصة آخر بيانات محفوظة"}`:`${n} بانتظار الرفع`}
window.addEventListener("online",()=>{offBar();if(MODE==="live"){if(OFF.q.length)offFlush();else if(OFF.on){OFF.on=false;reloadAll()}}});
window.addEventListener("offline",()=>{OFF.on=true;offBar()});
setInterval(()=>{if(OFF.q.length&&navigator.onLine&&MODE==="live")offFlush()},30000);
/* تحديث تلقائي: إذا نُشرت نسخة جديدة من الموقع تُحمَّل عند الرجوع للصفحة */
let APPV=null;
async function appVer(){try{const r=await fetch("app.js",{method:"HEAD",cache:"no-store"});return r.ok?(r.headers.get("etag")||r.headers.get("last-modified")):null}catch(e){return null}}
setTimeout(async()=>{APPV=await appVer()},4000);
async function checkUpd(){if(!APPV||!navigator.onLine)return;const v=await appVer();if(v&&v!==APPV){const busy=($("#modal")&&$("#modal").innerHTML.trim())||hasDrafts()||OFF.q.length;if(busy){toast("يوجد تحديث جديد للمنصة، سيُطبَّق عند إعادة فتح الصفحة");APPV=v;return}location.reload()}}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")checkUpd()});
setInterval(checkUpd,5*60*1000);
/* لقطة البيانات على الجهاز (IndexedDB) */
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open("maeen-off",1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbSet(k,v){try{const d=await idb();await new Promise((res,rej)=>{const t=d.transaction("kv","readwrite");t.objectStore("kv").put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error)})}catch(e){}}
async function idbGet(k){try{const d=await idb();return await new Promise((res,rej)=>{const t=d.transaction("kv","readonly");const r=t.objectStore("kv").get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}catch(e){return null}}
let SNAP_T=null;
function snapSave(){if(!UID||MODE!=="live"||OFF.on)return;const o={at:Date.now(),t:{}};TABLES.forEach(t=>{if(RAW[t])o.t[t]=[...RAW[t].values()]});idbSet("snap:"+UID,o)}
function snapSaveSoon(){clearTimeout(SNAP_T);SNAP_T=setTimeout(snapSave,4000)}
async function snapLoad(){if(!UID)return false;const o=await idbGet("snap:"+UID);if(!o||!o.t)return false;TABLES.forEach(t=>{RAW[t]=new Map((o.t[t]||[]).map(r=>[r.id,r]))});return true}
function swRegister(){if(!("serviceWorker" in navigator)||!(location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1"))return;navigator.serviceWorker.register("sw.js").catch(()=>{})}
/* ============ إشعارات تصل والمنصة مقفلة (Web Push) ============ */
const b64u=s=>{const p="=".repeat((4-s.length%4)%4);const b=atob((s+p).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from([...b].map(c=>c.charCodeAt(0)))};
const pushReady=()=>!!("serviceWorker" in navigator&&"PushManager" in window&&SB&&MODE==="live"&&CFG.supabaseUrl);
let VAPID_PUB="";
async function vapidKey(){if(!VAPID_PUB)VAPID_PUB=CFG.vapidPublicKey||"";if(VAPID_PUB)return VAPID_PUB;try{const r=await fetch(String(CFG.supabaseUrl).replace(/\/$/,"")+"/functions/v1/send-push");if(!r.ok)return"";const j=await r.json();VAPID_PUB=j.publicKey||"";return VAPID_PUB}catch(e){return""}}
async function pushSubscribe(){if(!pushReady())return;try{const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
    if(!sub){const vk=await vapidKey();if(!vk)return;sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(vk)})}const j=sub.toJSON();const m=me();if(!m)return;
    const id=await sha1(j.endpoint);const{error}=await SB.from("push_subs").upsert({id,data:{endpoint:j.endpoint,keys:j.keys,memberId:m.id,ua:navigator.userAgent.slice(0,120),at:new Date().toISOString()}});if(error)console.error(error)}catch(e){console.error(e)}}
async function pushUnsubscribe(){if(!pushReady())return;try{const reg=await navigator.serviceWorker.ready;const sub=await reg.pushManager.getSubscription();if(!sub)return;const id=await sha1(sub.endpoint);await SB.from("push_subs").delete().eq("id",id);await sub.unsubscribe()}catch(e){}}
async function sha1(t){const h=await crypto.subtle.digest("SHA-1",new TextEncoder().encode(t));return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,"0")).join("")}
/* ============ ترخيص النسخة (تتحقق من لوحة المالك) ============ */
let LIC=(()=>{try{return JSON.parse(localStorage.getItem("lic")||"null")}catch(e){return null}})();
const licLocked=()=>!!(LIC&&(LIC.status==="suspended"||(LIC.expires&&LIC.expires<today()&&LIC.status!=="active-forever")));
async function licPing(){const L=CFG.license;if(!L||!L.server||!L.key||!L.anonKey)return;const m=me();const last=+(localStorage.getItem("lic-at")||0);const admin=m&&m.role==="director";
  if(!admin&&Date.now()-last<6*36e5&&LIC)return;
  try{const body={p_key:L.key,p_url:location.origin};if(admin){body.p_students=allStudents().length;body.p_staff=S.members.filter(x=>x.status==="active"&&STAFF_ROLES.includes(x.role)).length;body.p_circles=S.circles.length}
    const r=await fetch(String(L.server).replace(/\/$/,"")+"/rest/v1/rpc/tenant_ping",{method:"POST",headers:{"Content-Type":"application/json",apikey:L.anonKey,Authorization:"Bearer "+L.anonKey},body:JSON.stringify(body)});if(!r.ok)return;
    const j=await r.json();if(!j||j.status==="unknown")return;LIC=j;try{localStorage.setItem("lic",JSON.stringify(j));localStorage.setItem("lic-at",String(Date.now()))}catch(e){}render()}catch(e){}}
function licLockView(){const exp=LIC.status!=="suspended";return `<main class="wrap"><div class="center-page"><img class="welcome-logo" src="${logoFull()}" alt=""><h1>${exp?"انتهى اشتراك المنصة":"الاشتراك موقوف مؤقتاً"}</h1><p class="muted">${esc(LIC.message||"بياناتكم محفوظة كما هي. يرجى التواصل مع مقدّم الخدمة لإعادة التفعيل.")}</p>${MODE==="live"?`<div class="row" style="justify-content:center"><button class="btn" data-act="logout">تسجيل الخروج</button></div>`:""}</div></main>`}
function licBanner(m){if(!LIC||!LIC.expires||!m||m.role!=="director")return"";const days=Math.round((new Date(LIC.expires)-new Date(today()))/864e5);return days>=0&&days<=10?`<div class="card" style="border-color:var(--warn)"><b>ينتهي اشتراك المنصة بعد ${days} ${days<=10&&days>2?"أيام":"يوم"}</b> <span class="small muted">(${fmtShort(LIC.expires)})، تواصل مع مقدّم الخدمة للتجديد.</span></div>`:""}
/* ============ لوحة المالك ============ */
const PROG_BASE=()=>location.origin+location.pathname.replace(/[^/]*$/,"");
const SCHEMA_URL="https://github.com/turkialmajedi/maeen-quran/blob/main/maeen-quran/supabase/schema.sql";
function progConfigText(d){const slug=d.slug||"program";return `// إعدادات برنامج «${d.name||slug}» — يُرفع هذا الملف إلى: maeen-quran/programs/${slug}/config.js
// المفتاح هنا هو المفتاح العام (publishable / anon) فقط. لا تضع أبداً مفتاح service_role.
window.APP_CONFIG = {
  tenant: "${slug}",
  supabaseUrl: "${d.sbUrl||"https://xxxxxxxx.supabase.co"}",
  supabaseAnonKey: "${d.sbKey||"sb_publishable_..."}",
  usernameDomain: "${slug}.s.maeen.com.sa",
  license: {
    server: "${CFG.supabaseUrl}",
    anonKey: "${CFG.supabaseAnonKey}",
    key: "${d.key}"
  },
};
`}
function progManifestText(d){return JSON.stringify({name:d.name||"منصة حلقات القرآن",short_name:(d.short||d.name||"الحلقات").slice(0,24),lang:"ar",dir:"rtl",start_url:"./",display:"standalone",background_color:"#f3f5f6",theme_color:d.color||"#284a70",icons:[{src:"icon-192.png",sizes:"192x192",type:"image/png"},{src:"icon-512.png",sizes:"512x512",type:"image/png",purpose:"any maskable"}]},null,2)}
function progDownload(name,text,type){try{const b=new Blob([text],{type:type||"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}catch(e){toast("تعذّر التنزيل","err")}}

const TN={list:null,loading:false};
async function tnLoad(){if(!SB)return;TN.loading=true;const{data,error}=await SB.from("tenants").select("id,data,updated_at").order("updated_at",{ascending:false});TN.loading=false;TN.list=error?[]:(data||[]);if(error)toast(errMsg(error,"تعذّر تحميل الجهات"),"err");render()}
function tenantsView(m){if(!isPA(m))return empty("هذه الصفحة لمسؤول المنصة فقط.");if(MODE!=="live")return empty("لوحة المالك تعمل في النسخة المنشورة فقط.");if(TN.list===null&&!TN.loading)tnLoad();
  const L=TN.list||[];const t0=today();const st=t=>t.data.status==="suspended"?["موقوف","p-bad"]:t.data.expires&&t.data.expires<t0?["منتهٍ","p-warn"]:["فعّال","p-ok"];
  const act=L.filter(t=>st(t)[0]==="فعّال");const sum=k=>L.reduce((a,t)=>a+n0((t.data.stats||{})[k]),0);
  return `<div class="hero"><div><h1>مسؤول المنصة</h1><div class="date">البرامج المشغّلة على المنصة — لكل برنامج هويته وقاعدة بياناته المستقلة</div></div><button class="btn pri" data-act="tnNew">إضافة برنامج</button></div>
  <div class="stats"><div class="stat"><b>${L.length}</b><span>برنامج</span></div><div class="stat"><b>${act.length}</b><span>اشتراك فعّال</span></div><div class="stat"><b>${sum("students")}</b><span>طالب في كل البرامج</span></div><div class="stat"><b>${sum("staff")}</b><span>معلم ومشرف</span></div></div>
  ${TN.loading&&!L.length?empty("جاري التحميل…"):L.length?`<div class="grid g2">${L.map(t=>{const d=t.data;const s0=st(t);const S0=d.stats||{};const left=d.expires?Math.round((new Date(d.expires)-new Date(t0))/864e5):null;
    return `<div class="card tncard"><div class="card-h"><h2>${esc(d.name)}</h2><span class="pill ${s0[1]}">${s0[0]}</span></div>
    <div class="small muted">${d.url?`<a href="${esc(d.url)}" target="_blank" rel="noopener" dir="ltr">${esc(d.url.replace(/^https?:\/\//,""))}</a>`:"لا رابط"}${d.plan?" · "+esc(d.plan):""}${d.contact?" · "+esc(d.contact):""}</div>
    <div class="tn-n"><span><b class="num">${n0(S0.students)}</b> طالب</span><span><b class="num">${n0(S0.staff)}</b> معلم ومشرف</span><span><b class="num">${n0(S0.circles)}</b> حلقة</span></div>
    <div class="small muted">${d.expires?`ينتهي ${fmtShort(d.expires)}${left!=null&&left>=0?` (بعد ${left} يوماً)`:""}`:"بدون تاريخ انتهاء"} · ${d.lastPing?"آخر اتصال "+nWhen(d.lastPing):"لم تتصل بعد"}</div>
    ${d.notes?`<p class="small" style="margin-top:6px">${esc(d.notes)}</p>`:""}
    <div class="row" style="margin-top:10px"><button class="btn sm" data-act="tnEdit" data-id="${t.id}">تعديل</button><button class="btn sm" data-act="tnLink" data-id="${t.id}">خطوات التشغيل</button><button class="btn sm ${d.status==="suspended"?"pri":"ghost danger"}" data-act="tnToggle" data-id="${t.id}">${d.status==="suspended"?"تفعيل":"إيقاف"}</button></div></div>`}).join("")}</div>`:empty("لا برامج بعد. أضف أول برنامج، ثم اتبع «خطوات التشغيل».")}
  <p class="hint">يتصل كل برنامج بلوحتك لتعرف حالة اشتراكها، وترسل أعداد المستخدمين فقط، ولا تصل إليك أي بيانات للطلاب.</p>`}
function tenantForm(t){const d=(t&&t.data)||{};const body=`<div class="fg">${fld("اسم البرنامج",inp("name",d.name,"text","required placeholder='مثال: برنامج مكنون'"))}${fld("رابط المنصة (يُملأ تلقائياً)",inp("url",d.url,"url","placeholder='https://...'"))}</div>
  <div class="fg">${fld("التواصل",inp("contact",d.contact,"text","placeholder='اسم المسؤول ورقمه'"))}${fld("الباقة",inp("plan",d.plan,"text","placeholder='مثال: سنوية — 200 طالب'"))}${fld("ينتهي الاشتراك في",inp("expires",d.expires,"date"),"اتركه فارغاً لاشتراك مفتوح")}</div>
  ${fld("رسالة تظهر لهم عند الإيقاف أو الانتهاء (اختياري)",inp("message",d.message,"text"))}${fld("ملاحظات خاصة بك",`<textarea name="notes" id="f-notes">${esc(d.notes||"")}</textarea>`)}<details class="card" style="margin-top:8px" ${d.slug?"":"open"}><summary><b>الإعدادات التقنية للبرنامج</b> <span class="small muted">(قاعدة البيانات والرابط)</span></summary>
  <div class="fg" style="margin-top:8px">${fld("المعرّف بالإنجليزي",inp("slug",d.slug,"text","pattern='[a-z0-9-]{2,30}' dir='ltr' placeholder='makanoon'"),"حروف إنجليزية صغيرة وأرقام فقط — يصير جزءاً من الرابط")}${fld("اللون الأساسي",inp("color",d.color||"#284a70","color"))}</div>
  <div class="fg">${fld("رابط Supabase للبرنامج (Project URL)",inp("sbUrl",d.sbUrl,"url","dir='ltr' placeholder='https://xxxx.supabase.co'"))}${fld("المفتاح العام (anon / publishable)",inp("sbKey",d.sbKey,"text","dir='ltr' placeholder='sb_publishable_...'"),"المفتاح العام فقط — لا تضع مفتاح service_role")}</div></details>`;
  openModal(t?"تعديل البرنامج":"برنامج جديد",body,"tenant",{id:t&&t.id},"حفظ")}
function circleForm(c){
  const m=me();c=c||{track:"hifz",days:[],time:"",duration:60,teacherId:m.id};const timed=(c.days||[]).length>0||!!c.time;
  const cur=c.id?circleStudents(c.id).map(s=>s.id):[];
  const pool=allStudents().filter(s=>inScope(m,s)||cur.includes(s.id));
  const body=`<div class="fg">${fld("اسم الحلقة",inp("name",c.name,"text","required placeholder='مثال: حلقة الفرقان'"))}${isAdmin(m)||scopeOf(m)==="circles"?fld("المعلم",sel("teacherId",teachers().map(t=>[t.id,t.name]),c.teacherId)):`<input type="hidden" name="teacherId" value="${m.id}">`}${fld("المسار",sel("track",Object.entries(CTRACK),c.track))}${divs().length?fld(DT(),sel("divisionId",[["","— بدون —"],...divChoices(m)],c.id?(c.divisionId||""):(curDiv(m)!=="all"?curDiv(m):""))):""}</div>
  <fieldset><legend>وقت الحلقة (اختياري)</legend><p class="hint">الحلقة دائمة يُضاف إليها الطلاب، والوقت للتوضيح فقط عند الحاجة.</p>
  <label class="switch" style="border:0;padding:0"><span>تحديد أيام ووقت للحلقة</span><input type="checkbox" name="timed" id="f-timed" data-change="timed" ${timed?"checked":""}></label>
  <div id="timed-box" class="stack" ${timed?"":"hidden"}><div class="chips">${DAYS.map((d,i)=>`<label><input type="checkbox" name="days" value="${i}" ${(c.days||[]).includes(i)?"checked":""}>${d}</label>`).join("")}</div>
  <div class="fg">${fld("الوقت",inp("time",c.time,"time"))}${fld("المدة (دقيقة)",inp("duration",c.duration||60,"number","min=10 step=5"))}</div></div></fieldset>
  ${fld("رابط اجتماع الحلقة (Google Meet أو Zoom)",inp("meetLink",c.meetLink,"url","placeholder='https://meet.google.com/xxx-xxxx-xxx'"),"رابط ثابت لكل لقاءات الحلقة. لإنشائه: «إنشاء Meet» أو «إنشاء Zoom» ثم انسخ الرابط والصقه هنا.")}
  <div><a class="btn sm" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn sm" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a></div>
  ${fld("وصف",`<textarea name="description" id="f-description">${esc(c.description||"")}</textarea>`)}
  <fieldset><legend>طلاب الحلقة</legend>${pool.length?`<div class="chips">${pool.map(s=>{const oc=s.circleId&&s.circleId!==c.id?get("circles",s.circleId):null;return `<label><input type="checkbox" name="students" value="${s.id}" ${cur.includes(s.id)?"checked":""}>${esc(s.name)}${oc?` <span class="hint">(في ${esc(oc.name)})</span>`:""}</label>`}).join("")}</div><span class="hint">الطالب يكون في حلقة واحدة؛ اختياره هنا ينقله من حلقته السابقة.</span>`:'<span class="hint">لا طلاب بعد.</span>'}</fieldset>`;
  openModal(c.id?"تعديل الحلقة":"حلقة جديدة",body,"circle",{id:c.id},"حفظ",c.id?`<button type="button" class="btn danger" data-act="delCircle" data-id="${c.id}">حذف الحلقة</button>`:"");
}

/* ============ البرامج ============ */
function visiblePrograms(m){
  if(isStaff(m))return S.programs.filter(p=>progDivOk(p,m));
  const vis=S.programs.filter(p=>!p.hidden);
  const ids=m.role==="student"?[m.id]:(m.childIds||[]);
  return vis.filter(p=>ids.some(id=>{const s=get("members",id);if(!progForS(p,s))return false;return p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(id):s&&p.audience===s.track)}));
}
const progOf=(sid,pid)=>(get("progress",`${sid}__${pid}`)||{done:[]}).done||[];
function programsView(m){
  if(isStaff(m)&&ui.ptab==="schedule")return programsTabs()+scheduleView(m);
  const P=visiblePrograms(m);
  return `${isStaff(m)?programsTabs():""}<div class="hero"><div><h1>البرامج العلمية</h1><div class="date">تفسير، تجويد، متون، تدبر… مع الدروس والمرفقات</div></div>${isStaff(m)?`<button class="btn pri" data-act="newProgram">برنامج جديد</button>`:""}</div>
  ${P.length?`<div class="grid g3">${P.map(p=>{const L=p.lessons||[];const mine=m.role==="student"?progOf(m.id,p.id).length:null;return `<div class="card clickable" data-act="openProgram" data-id="${p.id}" style="${p.hidden?"opacity:.6":""}"><div class="row between" style="margin-bottom:6px"><span class="row"><span class="pill p-acc">${PKIND[p.kind]||"عام"}</span>${p.hidden?'<span class="pill">مخفي عن الطلاب</span>':""}</span><span class="small muted">${L.length} درس</span></div><h3>${esc(p.title)}</h3><p class="small muted" style="margin-top:4px">${esc((p.description||"").slice(0,120))}</p>${mine!=null?`<div style="margin-top:10px">${pbar(mine,L.length)}<div class="small muted">أنجزت ${mine} من ${L.length}</div></div>`:`<div class="small muted" style="margin-top:8px">${p.audience==="all"?"لكل الطلاب":p.audience==="selected"?(p.studentIds||[]).length+" طالب":TRACK[p.audience]}</div>`}</div>`}).join("")}</div>`:empty(isStaff(m)?"لا برامج بعد. أنشئ برنامجاً مثل «تفسير جزء عم» وأضف له الدروس والمرفقات.":"لا برامج مسندة إليك حالياً.")}`;
}
function programsTabs(){return `<div class="subtabs"><button data-act="ptab" data-v="programs" class="${ui.ptab!=="schedule"?"on":""}">البرامج</button><button data-act="ptab" data-v="schedule" class="${ui.ptab==="schedule"?"on":""}">جداول الطلاب</button></div>`}
const tkLabel=t=>{if(t.programId&&get("programs",t.programId))return get("programs",t.programId).title;return ["hifz","murajaa","tilawa"].includes(t.kind)?KIND[t.kind]:(t.title||KIND[t.kind])};
function scheduleView(m){
  const wk=ui.wk||addDays(today(),-dow(today()));const days=[...Array(7)].map((_,i)=>addDays(wk,i));const td=today();
  const st=scoped(m);
  const fk=t=>ui.skind==="all"||(ui.skind==="programs"?!!t.programId||t.kind==="program"||t.kind==="tafsir":ui.skind==="hifz"?t.kind==="hifz"||t.kind==="murajaa":t.kind===ui.skind);
  const by={};st.forEach(s=>{const k=s.circleId&&get("circles",s.circleId)?s.circleId:"";(by[k]=by[k]||[]).push(s)});
  const keys=Object.keys(by).sort((a,b)=>!a?1:!b?-1:get("circles",a).name.localeCompare(get("circles",b).name,"ar"));
  const row=s=>{let D=0,N=0;const cells=days.map(d=>{const T=S.tasks.filter(t=>t.studentId===s.id&&t.date===d&&fk(t));T.forEach(t=>{N++;if(t.done)D++});
    return `<td class="${d===td?"today":""}">${T.map(t=>{const st2=t.done?"done":d<td?"miss":"open";return `<button class="tk tk-${st2}" data-act="toggleTask" data-id="${t.id}" title="${esc(taskTitle(t))}"><b>${t.done?"✓":st2==="miss"?"✗":"○"}</b><span>${esc(tkLabel(t).slice(0,16))}</span></button>`}).join("")}<button class="addc" data-act="newTaskAt" data-sid="${s.id}" data-d="${d}" aria-label="إضافة مهمة">+</button></td>`}).join("");
    return `<tr><td class="sn"><a href="#student" data-act="openStudent" data-id="${s.id}" style="color:inherit;text-decoration:none">${esc(s.name)}</a></td>${cells}<td><span class="pill ${N&&D===N?"p-ok":D?"p-pri":N?"p-bad":""}">${D}/${N}</span></td></tr>`};
  return `<div class="hero"><div><h1>جداول الطلاب</h1><div class="date">أسبوع ${fmtShort(days[0])} ← ${fmtShort(days[6])}</div></div><div class="toolbar"><button class="btn sm" data-act="wk" data-n="-7">→ الأسبوع السابق</button><button class="btn sm" data-act="wk" data-n="0">هذا الأسبوع</button><button class="btn sm" data-act="wk" data-n="7">الأسبوع التالي ←</button></div></div>
  <div class="toolbar"><select data-change="schedKind" id="sk">${[["all","كل المهام"],["programs","البرامج المصاحبة فقط"],["hifz","الحفظ والمراجعة"],["tilawa","التلاوة"]].map(([k,l])=>`<option value="${k}" ${ui.skind===k?"selected":""}>${l}</option>`).join("")}</select>${teacherFilter(m)}${circleFilter(m)}<button class="btn sm pri" data-act="newTask">مهمة لعدة طلاب</button></div>
  <div class="legend"><span><b style="color:var(--ok)">✓</b> منجزة</span><span><b style="color:var(--bad)">✗</b> لم تُنجز (فات يومها)</span><span><b>○</b> قادمة أو اليوم</span><span>اضغط المهمة لتبديل حالتها، و«+» لإضافة مهمة في ذلك اليوم.</span></div>
  ${st.length?`<div class="tbl-wrap"><table class="sched"><thead><tr><th class="sn">الطالب</th>${days.map(d=>`<th class="${d===td?"today":""}">${fmtD(d,{weekday:"long"})}<br><span class="num">${fmtD(d,{day:"numeric",month:"numeric"})}</span></th>`).join("")}<th>الإنجاز</th></tr></thead><tbody>
  ${keys.map(k=>`${keys.length>1||k?`<tr class="grp"><td colspan="9">${k?esc(get("circles",k).name):"بدون حلقة"} · ${by[k].length} طالب</td></tr>`:""}${by[k].map(row).join("")}`).join("")}</tbody></table></div>`:empty("لا يوجد طلاب.")}`;
}
function studentPrograms(s){
  const P=S.programs.filter(p=>!p.hidden&&progForS(p,s)).filter(p=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track));
  return P.length?`<div class="stack">${P.map(p=>{const d=progOf(s.id,p.id).length,L=(p.lessons||[]).length;return `<div class="li clickable" data-act="openProgram" data-id="${p.id}"><div class="grow"><div class="t">${esc(p.title)}</div>${pbar(d,L)}</div><span class="small num">${d}/${L}</span></div>`}).join("")}</div>`:empty("لا برامج لهذا الطالب.");
}
function programDetail(pid){
  const p=get("programs",pid);if(!p)return empty("البرنامج غير موجود.");
  const m=me();const staff=isStaff(m);const L=p.lessons||[];
  const students=allStudents().filter(s=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track)).filter(s=>!staff||inScope(m,s));
  const done=m.role==="student"?progOf(m.id,p.id):[];
  return `<div><button class="btn ghost sm" data-act="go" data-v="programs">→ رجوع للبرامج</button></div>
  <div class="card"><div class="row between"><div><span class="pill p-acc">${PKIND[p.kind]||"عام"}</span><h1 style="margin-top:6px">${esc(p.title)}</h1></div>${staff?`<div class="row"><button class="btn sm pri" data-act="newLesson" data-id="${p.id}">إضافة درس</button><button class="btn sm" data-act="editProgram" data-id="${p.id}">تعديل البرنامج</button><button class="btn sm" data-act="hideProgram" data-id="${p.id}">${p.hidden?"إظهار للطلاب":"إخفاء عن الطلاب"}</button></div>`:""}</div>${p.hidden&&staff?`<p class="small" style="margin-top:8px;color:var(--warn)">هذا البرنامج مخفي حالياً: لا يراه الطلاب ولا أولياء الأمور، ومهامه السابقة تبقى في سجلاتهم.</p>`:""}${p.description?`<p class="muted" style="margin-top:8px;white-space:pre-wrap">${esc(p.description)}</p>`:""}
  ${m.role==="student"?`<div style="margin-top:12px">${pbar(done.length,L.length)}<div class="small muted">أنجزت ${done.length} من ${L.length} درس</div></div>`:""}</div>
  <div class="stack">${L.length?L.map((l,i)=>{const isDone=done.includes(l.id);const cnt=staff?students.filter(s=>progOf(s.id,p.id).includes(l.id)).length:0;return `<div class="lesson"><div class="row between"><div class="row"><span class="rank">${i+1}</span>${l.kind&&l.kind!=="lesson"?`<span class="pill ${l.kind==="meeting"?"p-info":"p-acc"} lk">${LKIND[l.kind]}</span>`:""}<h3>${esc(l.title)}</h3>${l.kind==="meeting"&&l.at?`<span class="small muted">${fmtDT(l.at)}</span>`:l.date?`<span class="small muted">${fmtShort(l.date)}</span>`:""}</div>${m.role==="student"?`<button class="btn sm ${isDone?"":"pri"}" data-act="lessonDone" data-pid="${p.id}" data-id="${l.id}">${isDone?"✓ أنجزته":"أنهيت الدرس"}</button>`:staff?`<div class="row"><span class="small muted">أنجزه ${cnt}/${students.length}</span><button class="btn sm" data-act="lessonTask" data-pid="${p.id}" data-id="${l.id}">${S.tasks.some(t=>t.lessonId===l.id)?"أُرسل كمهمة ✓ إعادة":"إرسال كمهمة"}</button>${l.kind==="meeting"?`<button class="btn sm" data-act="lessonAtt" data-pid="${p.id}" data-id="${l.id}">تحضير (${Object.keys(l.att||{}).length})</button>`:""}<button class="btn ghost sm" data-act="editLesson" data-pid="${p.id}" data-id="${l.id}">تعديل</button></div>`:""}</div>${l.kind==="meeting"&&l.meetLink?`<div class="row" style="margin-top:6px"><a class="btn sm meet" href="${esc(l.meetLink)}" target="_blank" rel="noopener">${ICON.video} دخول اللقاء</a>${m.role==="student"&&(l.att||{})[m.id]?`<span class="pill p-ok">حضرت</span>`:""}</div>`:""}${l.body?`<div class="lesson-body">${esc(l.body)}</div>`:""}<div class="row">${l.link?`<a class="btn sm" href="${esc(l.link)}" target="_blank" rel="noopener">فتح الرابط ↗</a>`:""}${l.fileUrl?`<a class="btn sm" href="${esc(l.fileUrl)}" target="_blank" rel="noopener">المرفق: ${esc(l.fileName||"ملف")} ↗</a>`:""}</div></div>`}).join(""):empty("لا دروس بعد.")}</div>`;
}

/* ============ الطالب ============ */
function recordView(sid){
  const c=cfg();
  if(!c.studentSeeReport)return `<div class="app-stack"><h1>سجلي</h1>${logsCards(get("members",sid),logsOf(sid).slice(0,40),"student")}</div>`;
  return `<div class="app-stack"><div class="hero"><h1>سجلي وتقريري</h1></div>${periodPicker()}${reportInner(sid,curRange(sid),false)}</div>`;
}

/* ============ التقارير ============ */
function earliestLog(sid){let mn=null;S.logs.forEach(l=>{if((!sid||l.studentId===sid)&&(!mn||l.date<mn))mn=l.date});return mn}
function curRange(sid){
  const t=today();
  if(ui.pm==="custom"){if(ui.cmode==="range"&&ui.from&&ui.to){let f=ui.from,e=ui.to;if(f>e)[f,e]=[e,f];return[f,e]}return monthRange(ui.month)}
  if(ui.pm==="all"){const c=cfg();const st=sid&&get("members",sid);const f=c.termStart||(st&&st.plan&&st.plan.startDate)||earliestLog(sid)||addDays(t,-30);const e=c.termEnd&&c.termEnd<t?c.termEnd:t;return[f,e]}
  return monthRange(t.slice(0,7));
}
function periodLabel(r){r=r||curRange();const c=cfg();const lb={this:"هذا الشهر",custom:ui.cmode==="range"&&ui.from&&ui.to?"مخصص":"مخصص ("+monthName(ui.month)+")",all:"كامل "+(c.termName||"البرنامج")}[ui.pm]||"";return `${lb}: ${fmtShort(r[0])} ← ${fmtShort(r[1])}`}
function periodPicker(){
  const c=cfg();const opts=[["this","هذا الشهر"],["custom","مخصص"],["all","كامل "+(c.termName||"البرنامج")]];
  return `<div class="card period"><div class="row" style="gap:10px"><span class="small muted">فترة التقرير</span><div class="seg pseg">${opts.map(([k,l])=>`<button data-act="pm" data-v="${k}" class="${ui.pm===k?"on":""}">${l}</button>`).join("")}</div>
  ${ui.pm==="custom"?`<div class="row custom-box"><label class="row small ${ui.cmode!=="range"?"act":""}">الشهر <input type="month" id="mp" value="${ui.month}" data-change="month"></label><span class="small muted">أو</span><label class="row small ${ui.cmode==="range"?"act":""}">من <input type="date" id="pf" value="${ui.from||""}" data-change="pfrom"></label><label class="row small ${ui.cmode==="range"?"act":""}">إلى <input type="date" id="pt" value="${ui.to||""}" data-change="pto"></label>${ui.cmode==="range"&&!(ui.from&&ui.to)?'<span class="hint">أكمل التاريخين، وحتى ذلك يُعرض الشهر المختار</span>':""}</div>`:""}
  </div><div class="small muted" style="margin-top:6px">${periodLabel()}${ui.pm==="all"&&!c.termStart?" · حدّد تاريخ بداية البرنامج من «الإدارة» ليكون التقرير أدق":""}</div></div>`;
}
function monthPicker(){return periodPicker()}
function reportsView(m){
  const st=scoped(m);const[f,t]=curRange();
  const rows=st.map(s=>({s,x:stats(s.id,...(ui.pm==="all"?curRange(s.id):[f,t]))}));
  const tabs=`<div class="subtabs"><button data-act="rtype" data-v="students" class="${ui.rtype==="students"?"on":""}">تقرير الطلاب</button><button data-act="rtype" data-v="programs" class="${ui.rtype==="programs"?"on":""}">تقرير البرامج المصاحبة</button></div>`;
  if(ui.rtype==="programs")return `<div class="hero"><h1>التقارير</h1></div>${tabs}${periodPicker()}${programsReport(m)}`;
  return `<div class="hero"><h1>التقارير</h1><div class="toolbar"><select data-change="rstudent" id="rs"><option value="">تقرير طالب محدد…</option>${st.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select>${teacherFilter(m)}${circleFilter(m)}<button class="btn" data-act="xlsAll">${ICON.xls} Excel</button><button class="btn" data-act="pdfAll">${ICON.pdf} PDF</button><button class="btn" data-act="pdfCards">${ICON.pdf} تقرير فردي لكل طالب</button><button class="btn" data-act="copyAll">نسخ الملخص</button><button class="btn" data-act="weekSend" title="يرسل لكل ولي أمر ملخص أسبوع ابنه في «الرسائل»">إرسال ملخص الأسبوع لأولياء الأمور</button>${isDir()?`<label class="row small wk-auto"><input type="checkbox" data-change="weekAuto" ${cfg().weekAuto?"checked":""}> إرسال تلقائي كل خميس</label>`:""}</div></div>${tabs}${periodPicker()}
  <div class="stats"><div class="stat"><b>${rows.length}</b><span>طالب</span></div><div class="stat"><b>${(()=>{const r=rows.filter(r=>r.x.rate!=null);return r.length?Math.round(r.reduce((a,b)=>a+b.x.rate,0)/r.length)+"%":"—"})()}</b><span>متوسط الحضور</span></div><div class="stat"><b>${rows.reduce((a,r)=>a+r.x.newPages,0)}</b><span>أوجه حفظ جديد</span></div><div class="stat"><b>${rows.reduce((a,r)=>a+r.x.tPages,0)}</b><span>أوجه تلاوة</span></div><div class="stat"><b>${rows.reduce((a,r)=>a+r.x.done,0)}/${rows.reduce((a,r)=>a+r.x.tasks,0)}</b><span>مهام منجزة</span></div></div>
  ${rows.length?`<div class="tbl-wrap"><table><thead><tr><th>الطالب</th><th>المسار</th><th>الحضور</th><th>غياب</th><th>حفظ جديد</th><th>مراجعة</th><th>تلاوة</th><th>تنبيه/تلقين</th><th>متوسط التقدير</th><th>المهام</th><th>التسميع</th><th>النقاط</th></tr></thead><tbody>
  ${rows.map(({s,x})=>`<tr class="clickable" data-act="openReport" data-id="${s.id}"><td><b>${esc(s.name)}</b></td><td>${s.track==="tilawa"?"تلاوة":"حفظ"}</td><td class="num">${x.rate==null?"—":x.rate+"%"}</td><td class="num">${x.att.absent}</td><td class="num">${x.newPages}</td><td class="num">${x.revPages}</td><td class="num">${x.tPages}</td><td class="num">${x.errT}/${x.errL}</td><td><span class="pill ${gradeCls(x.avg)}">${x.avg?x.avg.toFixed(1)+" "+gradeTxt(x.avg):"—"}</span></td><td class="num">${x.done}/${x.tasks}</td><td class="num">${x.sess}</td><td class="num"><b>${x.points}</b></td></tr>`).join("")}</tbody></table></div><p class="hint">اضغط اسم الطالب لفتح تقريره المفصّل. النقاط = مهمة منجزة (1) + يوم حضور (2) + تقدير ممتاز (3).</p>`:empty("لا يوجد طلاب.")}`;
}
function programsReport(m){
  const[f,t]=curRange();const P=visiblePrograms(m);
  if(!P.length)return empty("لا برامج مصاحبة بعد.");
  return P.map(p=>{const st=programStudents(p);const L=p.lessons||[];
    const T=S.tasks.filter(x=>x.programId===p.id&&x.date>=f&&x.date<=t);
    const avg=st.length&&L.length?Math.round(st.reduce((a,s)=>a+progOf(s.id,p.id).filter(id=>L.some(l=>l.id===id)).length,0)/(st.length*L.length)*100):0;
    return `<div class="card"><div class="card-h"><div><span class="pill p-acc">${PKIND[p.kind]||"عام"}</span>${p.hidden?' <span class="pill">مخفي</span>':""}<h2 style="margin-top:4px">${esc(p.title)}</h2></div><div class="row"><button class="btn sm" data-act="xlsProg" data-id="${p.id}">${ICON.xls} Excel</button><button class="btn sm" data-act="pdfProg" data-id="${p.id}">${ICON.pdf} PDF</button><button class="btn sm" data-act="copyProgram" data-id="${p.id}">نسخ</button></div></div>
    <div class="stats" style="margin-bottom:12px"><div class="stat"><b>${L.length}</b><span>درس</span></div><div class="stat"><b>${st.length}</b><span>طالب مسجّل</span></div><div class="stat"><b>${avg}%</b><span>متوسط إنجاز الدروس</span></div><div class="stat"><b>${T.filter(x=>x.done).length}/${T.length}</b><span>مهام البرنامج في الفترة</span></div></div>
    ${st.length&&L.length?`<div class="tbl-wrap"><table><thead><tr><th>الطالب</th>${L.map((l,i)=>`<th title="${esc(l.title)}">${i+1}. ${esc(l.title.slice(0,18))}</th>`).join("")}<th>الإنجاز</th></tr></thead><tbody>${st.map(s=>{const d=progOf(s.id,p.id);const n=L.filter(l=>d.includes(l.id)).length;return `<tr><td><b>${esc(s.name)}</b></td>${L.map(l=>`<td style="text-align:center">${d.includes(l.id)?'<span style="color:var(--ok);font-weight:700">✓</span>':'<span class="muted">—</span>'}</td>`).join("")}<td><span class="pill ${n===L.length?"p-ok":n?"p-pri":""}">${Math.round(n/L.length*100)}%</span></td></tr>`}).join("")}</tbody></table></div>`:empty("لا طلاب أو دروس في هذا البرنامج.")}</div>`}).join("");
}
function programReportText(pid){const p=get("programs",pid);const st=programStudents(p);const L=p.lessons||[];
  return `تقرير برنامج «${p.title}» — ${cfg().circleName}\nعدد الدروس: ${L.length}\n\n`+st.map(s=>{const d=progOf(s.id,p.id);const n=L.filter(l=>d.includes(l.id)).length;return `${s.name}: ${n} من ${L.length} (${L.length?Math.round(n/L.length*100):0}%)`}).join("\n")}
function reportDetail(sid,staff){
  const s=get("members",sid);if(!s)return empty("غير موجود");try{if(!canSeeStudent(me(),sid))return empty("لا يمكنك عرض بيانات هذا الطالب")}catch(e){}
  return `<div><button class="btn ghost sm" data-act="go" data-v="${staff?"reports":"child"}">→ رجوع</button></div><div class="hero"><h1>تقرير ${esc(s.name)}</h1></div>${periodPicker()}`+reportInner(sid,curRange(sid),staff);
}
function reportInner(sid,[f,t],staff,compact){
  const s=get("members",sid);const x=stats(sid,f,t);const c=cfg();const isT=s.track==="tilawa";
  const showG=staff||c.studentSeeGrades;
  return `<div class="stack" style="gap:14px"><div class="row between"><span class="muted">الفترة: ${fmtShort(f)} ← ${fmtShort(t)}</span><div class="row">${staff?"":`<span></span>`}<button class="btn sm" data-act="xlsOne" data-id="${sid}">${ICON.xls} Excel</button><button class="btn sm" data-act="pdfOne" data-id="${sid}">${ICON.pdf} PDF</button>${navigator.canShare?`<button class="btn sm" data-act="pdfOne" data-id="${sid}" data-share="1">مشاركة PDF</button>`:""}<button class="btn sm" data-act="copyOne" data-id="${sid}">نسخ التقرير</button>${staff?`<button class="btn sm" data-act="parentMsg" data-id="${sid}">رسائل جاهزة لولي الأمر</button><button class="btn sm" data-act="copyParent" data-id="${sid}">نسخ تقرير ولي الأمر</button>`:""}</div></div>
  <div class="stats"><div class="stat"><b>${x.rate==null?"—":x.rate+"%"}</b><span>نسبة الحضور</span></div><div class="stat"><b>${x.att.present}/${x.att.late}/${x.att.absent}/${x.att.excused}</b><span>حاضر/متأخر/غائب/مستأذن</span></div>
  ${isT?`<div class="stat"><b>${x.tPages}</b><span>أوجه التلاوة</span></div><div class="stat"><b>${x.errT}/${x.errL}</b><span>تنبيه/تلقين</span></div>`:`<div class="stat"><b>${x.newPages}</b><span>أوجه الحفظ الجديد</span></div><div class="stat"><b>${x.revPages}</b><span>أوجه المراجعة</span></div>`}
  ${showG?`<div class="stat"><b>${x.avg?x.avg.toFixed(1):"—"}</b><span>متوسط التقدير ${x.avg?"("+gradeTxt(x.avg)+")":""}</span></div>`:""}<div class="stat"><b>${x.done}/${x.tasks}</b><span>المهام المنجزة</span></div><div class="stat"><b>${x.sess}</b><span>جلسات تسميع</span></div>${c.showPoints?`<div class="stat"><b>${x.points}</b><span>النقاط</span></div>`:""}</div>
  ${(()=>{const tj={};x.logs.forEach(l=>(l.tajweed||[]).forEach(k=>tj[k]=(tj[k]||0)+1));const k=Object.entries(tj).sort((a,b)=>b[1]-a[1]);return k.length&&(staff||c.studentSeeNotes)?`<div class="card"><h3 style="margin-bottom:8px">أحكام تكرر التنبيه عليها</h3><div class="chips">${k.map(([n,v])=>`<span class="pill p-warn">${n} × ${v}</span>`).join("")}</div></div>`:""})()}
  ${(()=>{const E=examsOf(sid,f,t);return E.length?`<div class="card"><div class="card-h"><h3>الاختبارات في الفترة</h3><span class="pill p-pri">المتوسط ${Math.round(E.reduce((a,e)=>a+n0(e.score),0)/E.length)}</span></div>${examsTable(E,false)}</div>`:""})()}
  ${staff?logsTable(s,x.logs,staff):logsCards(s,x.logs,me().role==="parent"?"parent":"student")}</div>`;
}
function reportText(sid,[f,t],forParent){
  const s=get("members",sid),x=stats(sid,f,t),isT=s.track==="tilawa";
  return `تقرير ${s.name} — ${cfg().circleName}\nالفترة: ${f} إلى ${t}\nالمسار: ${TRACK[s.track]}\nالحضور: ${x.rate==null?"—":x.rate+"%"} (غياب ${x.att.absent}، تأخر ${x.att.late}، استئذان ${x.att.excused})\n${isT?`التلاوة: ${x.tPages} وجه · الملاحظات: ${x.errT} تنبيه / ${x.errL} تلقين`:`الحفظ الجديد: ${x.newPages} وجه · المراجعة: ${x.revPages} وجه`}\nمتوسط التقدير: ${x.avg?x.avg.toFixed(1)+" ("+gradeTxt(x.avg)+")":"—"}\nالمهام: ${x.done} من ${x.tasks} · جلسات التسميع: ${x.sess}\nإجمالي ${isT?"المقروء":"المحفوظ"}: ${totalPages(s)} وجه${forParent?(()=>{const ns=x.logs.filter(l=>nP(l)).map(l=>`• ${l.date}: ${nP(l)}`);return (s.msgParent?`\n\nملاحظة المعلم: ${s.msgParent}`:"")+(ns.length?`\n\nملاحظات المتابعة:\n${ns.join("\n")}`:"")})():""}`;
}
function boardView(m){
  const[f,t]=curRange();const rows=lbRows(m,f,t);const pts=lbPts(m);
  const head=`<div class="hero"><div><h1>لوحة الشرف</h1><div class="date">${isStaff(m)?`${cfg().leaderboard?"ظاهرة للطلاب":"مخفية عن الطلاب حالياً"} · النقاط ${cfg().boardPoints?"ظاهرة":"مخفية"} لهم`:""}</div></div></div>${periodPicker()}`;
  if(!rows)return head+empty("جاري التحميل…");
  const R=rankRows(rows);const hl=m.role==="parent"?(m.childIds||[]):[m.id];const rest=R.slice(3);
  return head+`<div class="card board-card">${podiumHTML(R,hl,pts)}${(()=>{const mine=R.find(r=>hl.includes(r.s.id));return mine&&!isStaff(m)?`<div class="myrank"><span>${m.role==="parent"?"مركز ابنك":"مركزك"}</span><b class="num">${mine.rank}</b><span class="small muted">من ${R.length} طالباً</span></div>`:""})()}</div>
  ${rest.length?`<div class="card"><div class="list">${rest.map(r=>`<div class="li ${hl.includes(r.s.id)?"me-row":""}"><span class="rank">${r.rank}</span><div class="grow"><div class="t">${esc(r.s.name)}${hl.includes(r.s.id)?` <span class="pill p-acc">${m.role==="parent"?"ابنك":"أنت"}</span>`:""}</div>${isStaff(m)?`<div class="small muted">${TRACK[r.s.track]||""} · ${r.s.track==="tilawa"?r.x.tPages+" وجه تلاوة":r.x.newPages+" وجه حفظ"} · حضور ${r.x.rate==null?"—":r.x.rate+"%"}</div>`:`<div class="small muted">${TRACK[r.s.track]||""}</div>`}</div>${pts?`<b class="num">${r.x.points}</b><span class="small muted">نقطة</span>`:""}</div>`).join("")}</div></div>`:""}
  ${pts?`<p class="hint">النقاط = مهمة منجزة (1) + يوم حضور (2) + تقدير ممتاز (3).</p>`:""}`;
}

/* ============ الإعدادات ============ */
function settingsView(m){
  const c=cfg();
  const prof=`<div class="card"><div class="card-h"><h2>حسابي</h2></div><form class="stack" data-form="profile"><div class="fg">${fld("الاسم",inp("name",m.name,"text","required"))}${fld("الجوال",inp("phone",m.phone,"tel"))}</div>${fld("رابط الاجتماع الثابت (Google Meet أو Zoom)",inp("meetLink",m.meetLink,"url","placeholder='https://meet.google.com/abc-defg-hij'"),"أنشئ اجتماعاً متكرراً في Google Meet أو Zoom والصق رابطه هنا. يظهر لطلابك ويُملأ تلقائياً في المواعيد.")}<div class="row"><button class="btn pri">حفظ</button><button type="button" class="btn" data-act="changePass">تغيير كلمة المرور</button><button type="button" class="btn danger" data-act="logout">تسجيل الخروج</button><a class="btn" href="https://meet.google.com/new" target="_blank" rel="noopener">${ICON.video} إنشاء Meet</a><a class="btn" href="https://zoom.us/meeting/schedule" target="_blank" rel="noopener">${ICON.video} إنشاء Zoom</a></div></form></div>`;
  if(!can(m,"members.manage")&&!can(m,"settings.manage")){
    const pend=can(m,"members.approve")?S.members.filter(x=>x.status==="pending"&&x.role==="student"):[];
    return `<h1>حسابي</h1>${prof}${pend.length?`<div class="card"><div class="card-h"><h2>طلبات تسجيل الطلاب</h2></div><div class="list">${pend.map(x=>`<div class="li"><div class="grow"><div class="t">${esc(x.name)}</div><div class="small muted">${TRACK[x.track]||""} ${esc(x.note||"")}</div></div><button class="btn sm pri" data-act="approve" data-id="${x.id}">اعتماد</button></div>`).join("")}</div></div>`:""}`;
  }
  const sw=(k,l,h)=>`<label class="switch"><span><b>${l}</b>${h?`<br><span class="hint">${h}</span>`:""}</span><input type="checkbox" data-change="cfg" data-k="${k}" id="cfg-${k}" ${c[k]?"checked":""}></label>`;
  const order={pending:0,active:1,disabled:2};
  const mem=[...S.members].filter(x=>memDivOk(x,m)).sort((a,b)=>(order[a.status]-order[b.status])||a.role.localeCompare(b.role)||a.name.localeCompare(b.name,"ar"));
  return `<h1>الإدارة</h1>
  <div class="grid g2">${prof}
  ${can(m,"settings.manage")?`<div class="card"><div class="card-h"><h2>الحلقة والخصوصية</h2></div><form class="stack" data-form="circleName" style="margin-bottom:10px"><div class="fg">${fld("اسم المنصة / البرنامج",inp("circleName",c.circleName,"text","required"),"يظهر أعلى الموقع. والحلقات نفسها تُدار من «الحلقات»")}${fld("اسم البرنامج / الفصل",inp("termName",c.termName,"text","placeholder='مثال: الفصل الأول 1448'"))}</div><div class="fg">${fld("بداية البرنامج",inp("termStart",c.termStart,"date"))}${fld("نهاية البرنامج",inp("termEnd",c.termEnd,"date"))}</div><span class="hint">تُستخدم في تقرير «كامل البرنامج».</span><div><button class="btn sm pri">حفظ</button></div></form>
  ${sw("studentSeeGrades","إظهار التقديرات للطالب","تقدير الحفظ والمراجعة والأداء في سجله")}${sw("studentSeeNotes","إظهار ملاحظات المعلم للطالب")}${sw("studentSeeReport","إظهار التقرير الشهري للطالب")}${sw("parentsEnabled","تفعيل حسابات أولياء الأمور")}${sw("parentSeeReport","إظهار التقرير الكامل لولي الأمر")}${sw("parentSeeNotes","إظهار الملاحظات لولي الأمر")}${sw("showPoints","نظام النقاط","يظهر للطالب نقاطه الشهرية")}${sw("leaderboard","لوحة الشرف للطلاب","ترتيب الطلاب وأوائلهم ظاهر للطلاب وأولياء الأمور")}${sw("boardPoints","إظهار النقاط في لوحة الشرف","عند الإخفاء يظهر الترتيب فقط دون النقاط")}</div>`:""}</div>
  ${can(m,"settings.manage")?divAdminCard(m):""}
  ${isPA(m)?`<div class="card"><div class="card-h"><h2>مسؤول المنصة</h2><button class="btn sm pri" data-act="go" data-v="tenants">فتح الصفحة</button></div><p class="small muted">من هنا تضيف البرامج الجديدة (لكل برنامج هويته وقاعدة بياناته)، والتصميم والتخصيص كله من «التخصيص». لإضافة مسؤول منصة آخر: افتح بيانات العضو وفعّل «مسؤول المنصة».</p></div>`:""}
  ${can(m,"perms.manage")?`<div class="card"><div class="card-h"><h2>سلة المحذوفات</h2><button class="btn sm" data-act="go" data-v="trash">فتح السلة</button></div><p class="small muted">أي طالب أو سجل أو مهمة أو حلقة تُحذف تبقى 30 يوماً، ويمكن استرجاعها بضغطة.</p></div>`:""}
  ${can(m,"perms.manage")?`<div class="card"><div class="card-h"><h2>النسخ الاحتياطي</h2><button class="btn sm pri" data-act="backup">تنزيل نسخة احتياطية</button></div><p class="small muted">ملف واحد فيه كل بيانات المنصة (الأعضاء، الحلقات، السجلات، المهام، الاختبارات، الإعدادات…). احفظه دورياً. ويمكنك استيراد نسخة احتياطية (مثلاً من نسخة المنصة التجريبية) لتُضاف إلى البيانات الحالية.</p><div class="row" style="margin-top:8px"><label class="btn sm">استيراد نسخة احتياطية<input type="file" accept="application/json,.json" id="imp-file" data-change="importFile" hidden></label></div></div>`:""}
  ${can(m,"members.manage")?`<div class="card"><div class="card-h"><h2>الأعضاء</h2><div class="row"><button class="btn sm" data-act="impOpen">استيراد من Excel</button><button class="btn sm pri" data-act="addStudent">إضافة طالب</button><button class="btn sm" data-act="addMember">إضافة عضو</button></div></div>
  <div class="tbl-wrap"><table><thead><tr><th>الاسم</th><th>الصفة</th><th>الحالة</th><th>المسار</th><th>المعلم / الأبناء</th><th>الحساب</th><th></th></tr></thead><tbody>${mem.map(x=>`<tr><td><b>${esc(x.name)}</b>${x.note?`<div class="small muted" style="white-space:normal;max-width:240px">${esc(x.note)}</div>`:""}</td><td>${ROLE[x.role]||x.role}${(x.circleIds||[]).length&&["supervisor","assistant"].includes(x.role)?`<div class="small muted">${esc(x.circleIds.map(id=>(get("circles",id)||{}).name).filter(Boolean).join("، "))}</div>`:""}${Object.keys(x.permOverrides||{}).length?' <span class="pill p-acc">صلاحيات خاصة</span>':""}</td><td><span class="pill ${x.status==="active"?"p-ok":x.status==="pending"?"p-warn":""}">${x.status==="active"?"نشط":x.status==="pending"?"بانتظار الاعتماد":"موقوف"}</span></td><td>${x.role==="student"?(x.track==="tilawa"?"تلاوة":"حفظ"):"—"}</td><td>${x.role==="student"?esc(nameOf(x.teacherId)):x.role==="parent"?esc((x.childIds||[]).map(nameOf).join("، ")||"—"):"—"}</td><td>${x.uid?(x.username?`<span class="small">اسم المستخدم: <b dir="ltr">${esc(x.username)}</b></span>`:(x.email?`<span class="small" dir="ltr">${esc(x.email)}</span>`:"مرتبط")):(x.role!=="director"&&x.status!=="pending"?`<button class="btn sm" data-act="acctCreate" data-id="${x.id}">إنشاء حساب</button>`:"بدون حساب")}${x.uid&&x.username?` <button class="btn ghost sm" data-act="acctReset" data-id="${x.id}">كلمة مرور جديدة</button>`:""}</td><td><div class="row">${x.status==="pending"?`<button class="btn sm pri" data-act="approve" data-id="${x.id}">اعتماد</button>`:""}<button class="btn ghost sm" data-act="editMember" data-id="${x.id}">تعديل</button></div></td></tr>`).join("")}</tbody></table></div>
  <p class="hint" style="margin-top:8px">لدعوة المعلمين والطلاب: من زر المشاركة في أعلى الصفحة أضفهم أو فعّل الوصول بالرابط بصلاحية «مساهم» (Contributor)، ثم أرسل لهم الرابط ليسجّلوا.</p></div>`:""}`;
}
function memberForm(x,forceRole){
  const m=me();x=x||{role:forceRole||"student",status:"active",track:"hifz",teacherId:["teacher"].includes(m.role)?m.id:""};
  const role=x.role;const admin=can(m,"members.manage");const pm=can(m,"perms.manage");
  if(x.id&&x.role!=="student"&&!admin){toast("تعديل هذا العضو يحتاج صلاحية إدارة الأعضاء","err");return}
  const roleOpts=Object.entries(ROLE).filter(([k])=>k!=="director"||pm);
  const staffR=STAFF_ROLES.filter(r=>r!=="director");
  const unlinked=S.members.filter(s=>!s.uid&&s.id!==x.id&&s.role===x.role&&s.status!=="pending");
  const body=`<div class="fg">${fld("الاسم",inp("name",x.name,"text","required"))}${admin?fld("الصفة",sel("role",roleOpts,role,`data-change="mrole"`)):`<input type="hidden" name="role" value="${role}">`}${admin?fld("الحالة",sel("status",[["active","نشط"],["pending","بانتظار الاعتماد"],["disabled","موقوف"]],x.status)):`<input type="hidden" name="status" value="${x.status==="pending"?"active":x.status}">`}</div>
  <div id="role-student" ${role==="student"?"":"hidden"}><div class="fg">${fld("المسار",sel("track",[["hifz",TRACK.hifz],["tilawa",TRACK.tilawa]],x.track||"hifz"))}${fld("المعلم",sel("teacherId",[["","— اختر —"],...teachers().map(t=>[t.id,t.name])],x.teacherId||(admin?"":m.id)))}${fld("الحلقة",sel("circleId",[["","— بدون حلقة —"],...S.circles.map(c=>[c.id,c.name])],x.circleId||(ui.view==="circle"?ui.cid:"")))}${divs().length?fld(DT(),sel("divisionId",[["","— حسب الحلقة —"],...divChoices(m)],x.divisionId||(!x.id&&curDiv(m)!=="all"?curDiv(m):"")),"إذا كان في حلقة تتبع "+DT()+" فلا حاجة لاختيارها"):""}${fld("جوال ولي الأمر",inp("guardianPhone",x.guardianPhone,"tel"))}${fld("العمر / المرحلة",inp("level",x.level))}</div>
  </div>
  <div id="role-parent" ${role==="parent"?"":"hidden"}><div class="small muted" style="margin-bottom:6px">الأبناء</div><div class="chips">${allStudents().map(s=>`<label><input type="checkbox" name="childIds" value="${s.id}" ${(x.childIds||[]).includes(s.id)?"checked":""}>${esc(s.name)}</label>`).join("")||'<span class="hint">لا طلاب بعد</span>'}</div></div>
  <div id="role-teach" ${["teacher","director","admin","supervisor"].includes(role)&&(admin||can(m,"circles.manage"))?"":"hidden"}><div class="small muted" style="margin-bottom:6px">الحلقات التي يدرّسها <span class="hint">(يصبح معلم الحلقة)</span></div><div class="chips">${S.circles.map(c=>`<label><input type="checkbox" name="teachCircles" value="${c.id}" ${x.id&&c.teacherId===x.id?"checked":""}>${esc(c.name)}${c.teacherId&&c.teacherId!==x.id?` <span class="hint">(حالياً: ${esc(nameOf(c.teacherId))})</span>`:""}</label>`).join("")||'<span class="hint">لا حلقات بعد. أنشئها من «الحلقات».</span>'}</div><input type="hidden" name="teachSync" value="1"></div>
  <div id="role-circles" ${staffR.includes(role)?"":"hidden"}>${divs().length&&admin?`<div class="small muted" style="margin-bottom:6px">${DTP()} التي يعمل فيها <span class="hint">(بدون اختيار = كل ${DTP()}. إن اخترت يرى بياناتها فقط)</span></div><div class="chips" style="margin-bottom:12px">${divs().map(d=>`<label><input type="checkbox" name="divisionIds" value="${d.id}" ${(x.divisionIds||[]).includes(d.id)?"checked":""}>${esc(d.name)}</label>`).join("")}</div><input type="hidden" name="divSync" value="1">`:""}<div class="small muted" style="margin-bottom:6px">الحلقات المسندة إليه <span class="hint">(لمشرف الحلقات والمعلم المساعد، ولمن يُقيَّد تحضيره بحلقته)</span></div><div class="chips">${S.circles.map(c=>`<label><input type="checkbox" name="circleIds" value="${c.id}" ${(x.circleIds||[]).includes(c.id)?"checked":""}>${esc(c.name)}</label>`).join("")||'<span class="hint">لا حلقات بعد</span>'}</div></div>
  ${realPA()?`<div id="role-pa" ${STAFF_ROLES.includes(role)?"":"hidden"}><label class="switch pa-sw"><span><b>مسؤول المنصة</b> <span class="hint">— التصميم والتخصيص وتحريك العناصر وإدارة البرامج</span></span><input type="checkbox" name="platformAdmin" ${isPA(x)&&x.id?"checked":""}></label><input type="hidden" name="paSync" value="1"></div>`:""}
  ${pm?`<details id="role-ov" class="ovbox" ${staffR.includes(role)?"":"hidden"} ${Object.keys(x.permOverrides||{}).length||x.scopeOverride||x.attScopeOverride?"open":""}><summary>صلاحيات خاصة لهذا الشخص <span class="hint">(تتجاوز صلاحيات دوره)</span></summary>
   <div class="fg" style="margin-top:8px">${fld("نطاق البيانات",sel("scopeOv",[["","حسب الدور"],...Object.entries(SCOPE)],x.scopeOverride||""))}${fld("نطاق التحضير",sel("attOv",[["","حسب الدور"],["data","كل من في نطاقه"],["circle","حلقته فقط"]],x.attScopeOverride||""),"«حلقته فقط»: الحلقات التي هو معلمها أو المسندة إليه أعلاه")}</div>
   <div class="ovgrid">${PERMS.map(([k,l])=>{const v=(x.permOverrides||{})[k];return `<label class="ovrow"><span>${l}</span><select name="ov_${k}" id="f-ov_${k}"><option value="" ${v==null?"selected":""}>حسب الدور</option><option value="1" ${v===true?"selected":""}>سماح</option><option value="0" ${v===false?"selected":""}>منع</option></select></label>`}).join("")}</div></details>`:""}
  ${x.status==="pending"&&x.uid&&unlinked.length?fld("ربط بسجل موجود (اختياري)",sel("linkTo",[["","— لا، سجل جديد —"],...unlinked.map(s=>[s.id,s.name])],""),"إذا كان له سجل سابق بدون حساب (مثلاً من النسخة الاحتياطية)، اربطه هنا ليحتفظ بسجله وخطته."):""}
  ${!x.id&&role==="student"?`<fieldset><legend>حساب الدخول</legend><label class="switch" style="border:0;padding:0"><span>إنشاء حساب دخول للطالب الآن <span class="hint">(للطالب الذي ليس لديه إيميل)</span></span><input type="checkbox" name="mkAcct" id="f-mkAcct" data-change="mkAcct"></label><div id="mk-box" class="fg" hidden>${fld("اسم المستخدم",inp("username","","text","dir='ltr' autocapitalize='off' autocomplete='off' placeholder='ahmad.salem'"),"حروف إنجليزية وأرقام فقط")}${fld("كلمة المرور",inp("password",genPass(),"text","dir='ltr' autocomplete='off' minlength=8"),"يمكنك تغييرها")}</div></fieldset>`:""}
  <div class="fg">${fld("الجوال",inp("phone",x.phone,"tel"))}</div>${x.email?`<p class="small muted">الإيميل: ${esc(x.email)}</p>`:""}${fld("ملاحظات",`<textarea name="note" id="f-note">${esc(x.note||"")}</textarea>`)}`;
  openModal(x.id?(x.status==="pending"?"اعتماد التسجيل":"تعديل البيانات"):role==="student"?"إضافة طالب":"إضافة عضو",body,"member",{id:x.id},x.status==="pending"?"اعتماد":"حفظ",x.id&&admin&&x.id!==m.id?`<button type="button" class="btn danger" data-act="delMember" data-id="${x.id}">حذف</button>`:"");
}
function planForm(s){
  const isT=s.track==="tilawa";const p=s.plan||{days:[0,1,2,3,4],startDate:today()};
  const dir=p.dir||(n0(p.gFromS)&&n0(p.gToS)&&n0(p.gFromS)>n0(p.gToS)?"up":p.direction==="من الناس صعوداً"?"up":"down");
  const dS=dir==="up"?[114,1,1,7]:[isT?1:2,1,114,6];
  const fS=n0(p.gFromS)||dS[0],fA=n0(p.gFromA)||1,tS=n0(p.gToS)||dS[2],tA=n0(p.gToA)||SURAHS[(n0(p.gToS)||dS[2])-1].a;
  const aN=p.unit==="line"?(p.amtU==="page"?n0(p.amtN)||n0(p.amt)/15:n0(p.amtN)||n0(p.amt)):p.unit==="page"&&n0(p.amt)?n0(p.amt):"";
  const aU=p.unit==="line"?(p.amtU||"line"):p.unit==="page"&&n0(p.amt)?"page":"line";
  const Q=[[3,"3 أسطر"],[5,"5 أسطر"],[7.5,"نصف وجه"],[15,"وجه"],[30,"وجهان"]];
  loadMushaf();
  const TP=tplList().filter(t=>!t.track||t.track===s.track);
  const body=`<p class="hint">${TRACK[s.track]} — يمكن تغيير المسار من «تعديل البيانات».</p>
  ${TP.length?fld("البدء من قالب جاهز (اختياري)",sel("tplPick",[["","— اختر قالباً —"],...TP.map(t=>[t.id,t.name])],""),"يملأ الحقول بإعدادات القالب، ويمكنك تعديلها بعده"):""}
  <fieldset><legend>١. اتجاه ${isT?"التلاوة":"الحفظ"}</legend><div class="seg2">${[["down",isT?"من الفاتحة نزولاً":"من البقرة نزولاً","الفاتحة ← الناس"],["up","من الناس صعوداً","الناس ← البقرة"]].map(([k,l,h])=>`<label class="segopt"><input type="radio" name="dir" value="${k}" ${dir===k?"checked":""}><span><b>${l}</b><small>${h}</small></span></label>`).join("")}</div>
  <div class="fg">${fld("يبدأ من سورة",surahNumSel("gFromS",fS))}${fld("من الآية",inp("gFromA",fA,"number","min=1"))}${fld("وينتهي عند سورة",surahNumSel("gToS",tS))}${fld("حتى الآية",inp("gToA",tA,"number","min=1"))}</div></fieldset>
  <fieldset><legend>٢. الورد اليومي</legend><div class="chips qamt">${Q.map(([v,l])=>`<button type="button" class="chip-b ${aU==="line"&&+aN===v||aU==="page"&&+aN*15===v?"on":""}" data-act="amtPick" data-v="${v}">${l}</button>`).join("")}</div>
  <div class="fg">${fld("المقدار",inp("amtN",aN,"number","min=0.5 step=0.5 required placeholder='مثال: 5'"))}${fld("الوحدة",sel("amtU",[["line","سطر"],["page","وجه (15 سطراً)"]],aU))}</div>
  <p class="hint">تُحسب الأسطر من مصحف المدينة (15 سطراً في الوجه)، ويُقسَّم الورد على الأيام فيظهر لكل يوم «من آية كذا إلى آية كذا» منتهياً عند نهاية آية.</p></fieldset>
  <fieldset><legend>٣. مدة الخطة وأيامها</legend><div class="fg">${fld("من تاريخ",inp("startDate",p.startDate||today(),"date","required"))}${fld("إلى تاريخ",inp("endDate",p.endDate,"date"))}</div>
  <div class="small muted" style="margin:4px 0 6px">أيام الخطة</div><div class="chips">${DAYS.map((d,i)=>`<label><input type="checkbox" name="days" value="${i}" ${(p.days||[]).includes(i)?"checked":""}>${d}</label>`).join("")}</div></fieldset>
  ${isT?"":revSection(p,dir)}
  ${fld("اسم الهدف (اختياري)",inp("goal",p.goal,"text",isT?"placeholder='مثال: ختمة مجوّدة خلال الفصل'":"placeholder='مثال: حفظ جزء تبارك'"))}
  <div class="plan-est" id="plan-est" aria-live="polite"></div>
  <details class="tplsave"><summary>حفظ هذه الإعدادات كقالب لاستخدامها مع طلاب آخرين</summary><div class="row" style="margin-top:8px"><input id="tpl-name" placeholder="اسم القالب، مثل: جزء عم في فصل" style="flex:1;min-width:180px"><button type="button" class="btn sm" data-act="tplSave">حفظ القالب</button></div></details>
  ${n0(p.nextS)?`<label class="switch" style="border:0;padding:0"><span>إعادة التوزيع من بداية الخطة (الموضع الحالي: سورة ${SN(n0(p.nextS))} الآية ${n0(p.nextA)||1})</span><input type="checkbox" name="resetPtr" id="f-resetPtr"></label>`:""}`;
  openModal(`خطة ${esc(s.name)}`,body,"plan",{sid:s.id},"حفظ الخطة");setTimeout(planEstUpd,0);
}
/* ===== حساب الأسطر من مصحف المدينة ===== */
const SOFF=(()=>{const o=[0];for(let i=0;i<114;i++)o.push(o[i]+SURAHS[i].a);return o})();
const gOf=(s,a)=>SOFF[s-1]+a-1;
function mqAL(){const M=MQ;if(!M)return null;if(M.al)return M.al;const al=new Float32Array(M.a.length),L=M.l,n=M.w.length;
  for(let li=0;li<L.length;li++){const a=L[li],b=li+1<L.length?L[li+1]:n,k=1/(b-a);for(let wi=a;wi<b;wi++)al[M.wa[wi]]+=k}return M.al=al}
async function ensureMQ(){loadMushaf();for(let i=0;i<150&&!MQ&&MQLOAD!=="err";i++)await new Promise(r=>setTimeout(r,100));return !!MQ}
function segs(s1,a1,s2,a2){const out=[];if(!s1||!s2)return out;if(s1===s2)out.push([s1,Math.min(a1,a2),Math.max(a1,a2)]);
  else if(s1<s2){out.push([s1,a1,SURAHS[s1-1].a]);for(let x=s1+1;x<s2;x++)out.push([x,1,SURAHS[x-1].a]);out.push([s2,1,a2])}
  else{out.push([s1,a1,SURAHS[s1-1].a]);for(let x=s1-1;x>s2;x--)out.push([x,1,SURAHS[x-1].a]);out.push([s2,1,a2])}return out}
function rangeLines(s1,a1,s2,a2){const al=mqAL();if(!al)return 0;let t=0;segs(s1,a1,s2,a2).forEach(([x,f,e])=>{for(let a=f;a<=e;a++)t+=al[gOf(x,a)]});return t}
function lnTxt(n){n=Math.round(n*2)/2;if(n>=14&&Math.abs(n-Math.round(n/15)*15)<=1.5){const v=Math.round(n/15);return v===1?"وجه":v===2?"وجهان":v<=10?`${v} أوجه`:`${v} وجهاً`}
  if(n===7.5)return"نصف وجه";const w=Math.floor(n),h=n-w>0;const W=w===1?"سطر":w===2?"سطران":w<=10?`${w} أسطر`:`${w} سطراً`;return !w?"نصف سطر":h?W+" ونصف":W}
function amtTxt(p){if(p.unit==="line"&&n0(p.amt))return lnTxt(n0(p.amt));if(n0(p.amt))return `${p.amt} ${p.unit==="ayah"?"آية":"وجه"}`;return p.dailyNew||p.dailyTilawa||"—"}
function sessionsBetween(from,to,days){let n=0;for(let d=from;d<=to;d=addDays(d,1))if(days.includes(dow(d)))n++;return n}
function finishDate(from,days,need){if(!days.length||need<=0)return null;let d=from,n=0;for(let i=0;i<4000;i++){if(days.includes(dow(d))){n++;if(n>=need)return d}d=addDays(d,1)}return null}
function planEstimate(p){const s1=n0(p.gFromS),s2=n0(p.gToS);if(!s1||!s2||!n0(p.amt))return null;if(!mqAL())return{loading:true};
  const a1=n0(p.gFromA)||1,a2=n0(p.gToA)||SURAHS[s2-1].a;const total=rangeLines(s1,a1,s2,a2);const days=p.days&&p.days.length?p.days:[0,1,2,3,4];
  const need=Math.ceil(total/n0(p.amt)-0.05);const from=p.startDate||today();const fin=finishDate(from,days,need);
  const avail=p.endDate?sessionsBetween(from,p.endDate,days):null;return{total,need,fin,avail,perDay:avail?total/avail:null}}
function planEstHTML(e,p){if(!e)return"";if(e.loading)return `<div class="small muted">جاري حساب الأسطر…</div>`;
  const ok=e.avail==null||e.avail>=e.need;
  return `<div class="pe-g"><div><span>مقدار الخطة</span><b class="num">${Math.round(e.total)} سطراً</b><small class="num">≈ ${(e.total/15).toFixed(1)} وجه</small></div><div><span>عدد أيام الورد</span><b class="num">${e.need}</b><small>يوماً</small></div><div><span>الانتهاء المتوقع</span><b class="num">${e.fin?fmtShort(e.fin):"—"}</b><small>${e.fin?fmtD(e.fin,{weekday:"long"}):""}</small></div></div>
  ${e.avail!=null?`<div class="pe-msg ${ok?"ok":"warn"}">${ok?`المدة كافية: ${e.avail} يوم ورد حتى ${fmtShort(p.endDate)}${e.avail>e.need?`، ويتبقى ${e.avail-e.need} يوماً للمراجعة`:""}.`:`المدة لا تكفي: المتاح ${e.avail} يوماً والمطلوب ${e.need}. لإنهائها في موعدها اجعل الورد نحو <b>${lnTxt(Math.ceil(e.perDay*2)/2)}</b> يومياً، أو مدّد تاريخ النهاية.`}</div>`:""}`}
function planFromForm(f){const fd=new FormData(f);const g=k=>fd.get(k);const u=g("amtU")||"line",n=parseFloat(g("amtN"))||0;
  return{dir:g("dir")||"down",gFromS:n0(g("gFromS")),gFromA:n0(g("gFromA"))||1,gToS:n0(g("gToS")),gToA:n0(g("gToA")),amt:n*(u==="page"?15:1),amtN:n,amtU:u,unit:"line",startDate:g("startDate"),endDate:g("endDate"),days:fd.getAll("days").map(Number),rev:revFromForm(fd)}}
function planEstUpd(){const f=document.querySelector('form[data-form="plan"]');const box=$("#plan-est");if(!f||!box)return;const p=planFromForm(f);const e=planEstimate(p);box.innerHTML=planEstHTML(e,p);const rb=$("#rev-est");if(rb)rb.innerHTML=revEstHTML(p);const rbx=$("#rev-box");if(rbx)rbx.hidden=!(p.rev&&p.rev.on);if(e&&e.loading)ensureMQ().then(()=>{if(MQ)planEstUpd()})}
document.addEventListener("input",e=>{if(e.target.closest&&e.target.closest('form[data-form="plan"]'))planEstUpd()});
document.addEventListener("change",e=>{if(e.target.name==="tpl"&&e.target.closest('form[data-form="bulkPlan"]')){const d=n0(e.target.dataset.dur);const f=e.target.form;const sd=f.querySelector('[name="startDate"]').value||today();f.querySelector('[name="endDate"]').value=d?addDays(sd,d):""}});
document.addEventListener("change",e=>{const f=e.target.closest&&e.target.closest('form[data-form="plan"]');if(!f)return;
  if(e.target.name==="dir"){const up=e.target.value==="up";const set=(k,v)=>{const x=f.querySelector(`[name="${k}"]`);if(x)x.value=v};const isT=get("members",modalCtx.sid)?.track==="tilawa";
    if(up){set("gFromS",114);set("gFromA",1);set("gToS",1);set("gToA",7)}else{set("gFromS",isT?1:2);set("gFromA",1);set("gToS",114);set("gToA",6)}}
  if(e.target.name==="gToS"){const x=f.querySelector('[name="gToA"]');const v=n0(e.target.value);if(x&&v)x.value=SURAHS[v-1].a}
  if(e.target.name==="gFromS"){const x=f.querySelector('[name="gFromA"]');if(x)x.value=1}
  if(e.target.name==="amtN"||e.target.name==="amtU")f.querySelectorAll(".qamt .chip-b").forEach(b=>b.classList.remove("on"));
  if(e.target.name==="tplPick"&&e.target.value){const t=tplList().find(x=>x.id===e.target.value);if(t)tplFill(f,t)}
  if(e.target.name==="revN"||e.target.name==="revU")f.querySelectorAll(".qrev .chip-b").forEach(b=>b.classList.remove("on"));
  if(e.target.name==="revDir"){const up=e.target.value==="up";const set=(k,v)=>{const x=f.querySelector(`[name="${k}"]`);if(x)x.value=v};if(up){set("rFromS",114);set("rFromA",1);set("rToS",78);set("rToA",40)}else{set("rFromS",1);set("rFromA",1);set("rToS",2);set("rToA",286)}}
  if(e.target.name==="rToS"){const x=f.querySelector('[name="rToA"]');const v=n0(e.target.value);if(x&&v)x.value=SURAHS[v-1].a}
  if(e.target.name==="rFromS"){const x=f.querySelector('[name="rFromA"]');if(x)x.value=1}
  planEstUpd()});
function taskForm(t,sid){
  t=t||{date:today(),kind:"hifz"};
  const body=`<div class="fg">${fld("التاريخ",inp("date",t.date,"date","required"))}${fld("النوع",sel("kind",Object.entries(KIND),t.kind))}</div><div class="fg">${fld("السورة (اختياري)",surahNumSel("surah",t.surah))}${fld("من الآية",inp("fromA",t.fromA,"number","min=1"))}${fld("إلى الآية",inp("toA",t.toA,"number","min=1"))}</div>${fld("العنوان",inp("title",t.title,"text","placeholder='يُكتب تلقائياً إذا اخترت السورة، مثل: حفظ سورة الملك'"))}${fld("التفاصيل",`<textarea name="details" id="f-details">${esc(t.details||"")}</textarea>`)}${fld("رابط (اختياري)",inp("link",t.link,"url","placeholder='https://'"),"مقطع تلاوة، ملف Drive، درس تفسير…")}
  ${ASSETS?fld("إرفاق ملف (صفحة تفسير، PDF، صورة، صوت)",`<input type="file" name="file" id="f-file" accept=".pdf,image/*,audio/*,video/*,.txt,.md,.csv">`,t.fileName?"المرفق الحالي: "+esc(t.fileName):"حتى 20 ميجابايت"):`<p class="hint">رفع الملفات متاح لمن لديه صلاحية «محرر» على الرابط، ويمكن وضع رابط Google Drive بدلاً منه.</p>`}
  ${t.id?"":(sid||t.studentId)?`<label class="switch" style="border:0"><span>إسناد المهمة نفسها لكل طلابي</span><input type="checkbox" name="all" id="f-all"></label>`:`<fieldset><legend>الطلاب</legend><label class="switch" style="border:0;padding:0"><span>كل طلابي${ui.circle!=="all"&&get("circles",ui.circle)?" في "+esc(get("circles",ui.circle).name):""}</span><input type="checkbox" name="all" id="f-all"></label><div class="chips">${scoped(me()).map(x=>`<label><input type="checkbox" name="sids" value="${x.id}">${esc(x.name)}</label>`).join("")}</div></fieldset>`}`;
  openModal(t.id?"تعديل المهمة":"مهمة جديدة",body,"task",{id:t.id,sid:t.studentId||sid},"حفظ",t.id?`<button type="button" class="btn danger" data-act="delTask" data-id="${t.id}">حذف</button>`:"");
}
function programForm(p){
  p=p||{kind:"tafsir",audience:"all",studentIds:[]};const m=me();
  const body=`<div class="fg">${fld("اسم البرنامج",inp("title",p.title,"text","required placeholder='مثال: تفسير جزء عم'"))}${fld("النوع",sel("kind",Object.entries(PKIND),p.kind))}${fld("موجه إلى",sel("audience",[["all","كل الطلاب"],["hifz",TRACK.hifz],["tilawa",TRACK.tilawa],["selected","طلاب محددون"]],p.audience,`data-change="aud"`))}</div>
  ${fld("الوصف",`<textarea name="description" id="f-description">${esc(p.description||"")}</textarea>`)}
  ${divs().length?`<div><div class="small muted" style="margin-bottom:6px">${DTP()} <span class="hint">(بدون اختيار = كل ${DTP()})</span></div><div class="chips">${divChoices(me()).map(([id,n])=>`<label><input type="checkbox" name="divisionIds" value="${id}" ${(p.divisionIds||(p.id?[]:curDiv(me())!=="all"?[curDiv(me())]:[])).includes(id)?"checked":""}>${esc(n)}</label>`).join("")}</div></div>`:""}
  <label class="switch" style="border:0;padding:0"><span>إخفاء البرنامج عن الطلاب مؤقتاً</span><input type="checkbox" name="hidden" id="f-hidden" ${p.hidden?"checked":""}></label>
  <div id="aud-sel" ${p.audience==="selected"?"":"hidden"}><div class="small muted" style="margin-bottom:6px">الطلاب</div><div class="chips">${myStudents(m).map(s=>`<label><input type="checkbox" name="studentIds" value="${s.id}" ${(p.studentIds||[]).includes(s.id)?"checked":""}>${esc(s.name)}</label>`).join("")}</div></div>`;
  openModal(p.id?"تعديل البرنامج":"برنامج جديد",body,"program",{id:p.id},"حفظ",p.id?`<button type="button" class="btn danger" data-act="delProgram" data-id="${p.id}">حذف البرنامج</button>`:"");
}
function lessonForm(pid,l){
  l=l||{};
  const body=`<div class="fg">${fld("النوع",sel("kind",Object.entries(LKIND),l.kind||"lesson"))}${fld("العنوان",inp("title",l.title,"text","required placeholder='مثال: تفسير سورة النبأ 1–16 أو لقاء: اسم الله الرحمن'"))}${fld("التاريخ",inp("date",l.date||today(),"date"),"للرسالة التحفيزية: تظهر للطلاب في هذا اليوم")}</div>
  <fieldset><legend>للقاء فقط</legend><div class="fg">${fld("موعد اللقاء",inp("at",l.at?l.at.slice(0,16):"","datetime-local"))}${fld("رابط اللقاء (Meet أو Zoom)",inp("meetLink",l.meetLink,"url","placeholder='https://meet.google.com/…'"))}</div></fieldset>${fld("المحتوى أو الفوائد",`<textarea name="body" id="f-body" style="min-height:120px">${esc(l.body||"")}</textarea>`)}${fld("رابط (يوتيوب، Drive، PDF…)",inp("link",l.link,"url","placeholder='https://'"))}
  ${ASSETS?fld("رفع ملف مرفق",`<input type="file" name="file" id="f-file" accept=".pdf,image/*,audio/*,video/*,.txt,.md,.csv">`,l.fileName?"المرفق الحالي: "+esc(l.fileName):"PDF أو صورة أو صوت حتى 20 ميجابايت"):`<p class="hint">رفع الملفات متاح لمن لديه صلاحية «محرر». يمكن إضافة رابط Google Drive بدلاً من ذلك.</p>`}`;
  const body2=body+(l.id?"":`<fieldset><legend>إرساله كمهمة للطلاب</legend><label class="switch" style="border:0;padding:0"><span>أضفه مهمةً في جدول طلاب البرنامج</span><input type="checkbox" name="asTask" id="f-asTask" checked></label>${fld("تاريخ المهمة",inp("taskDate",l.date||today(),"date"))}</fieldset>`);
  openModal(l.id?"تعديل الدرس":"درس جديد",body2,"lesson",{pid,id:l.id},"حفظ",l.id?`<button type="button" class="btn danger" data-act="delLesson" data-pid="${pid}" data-id="${l.id}">حذف</button>`:"");
}

/* ============ الأحداث ============ */
function go(v){ui.view=v;window.scrollTo(0,0);try{history.replaceState(null,"","#"+v)}catch(e){}render()}
async function copy(text){try{await navigator.clipboard.writeText(text);toast("نُسخ. الصقه في واتساب أو أي مكان.")}catch(e){openModal("انسخ النص",`<textarea id="f-copy" style="min-height:220px;width:100%;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--bg)">${esc(text)}</textarea>`,"noop",{}, "تم");setTimeout(()=>{const t=$("#f-copy");t&&t.select()},50)}}
function programStudents(p){const m=me();return allStudents().filter(s=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track)).filter(s=>inScope(m,s))}
function lessonToTasks(p,l,date){const st=programStudents(p);const kind=p.kind==="tafsir"?"tafsir":"program";
  st.forEach(s=>{if(S.tasks.some(t=>t.studentId===s.id&&t.lessonId===l.id&&t.date===date))return;put("tasks","t"+gen(),{studentId:s.id,date,kind,title:`${p.title}: ${l.title}`,details:l.body||"",link:l.link||"",fileUrl:l.fileUrl||"",fileName:l.fileName||"",programId:p.id,lessonId:l.id,done:false,createdBy:me().id})});return st.length}
const A={
  hideProgram:el=>{const p=get("programs",el.dataset.id);patch("programs",p.id,{hidden:!p.hidden});toast(p.hidden?"البرنامج ظاهر للطلاب الآن":"أُخفي البرنامج عن الطلاب")},
  lessonTask:el=>{const p=get("programs",el.dataset.pid);const l=(p.lessons||[]).find(x=>x.id===el.dataset.id);openModal("إرسال الدرس كمهمة",`<p>سيُضاف «${esc(l.title)}» بمحتواه ومرفقاته مهمةً في جدول ${programStudents(p).length} طالب.</p>${fld("تاريخ المهمة",inp("taskDate",today(),"date","required"))}`,"lessonTask",{pid:p.id,lid:l.id},"إرسال")},
  go:el=>go(el.dataset.v),
  stab:el=>{ui.stab=el.dataset.v;render()},
  openStudent:el=>{ui.sid=el.dataset.id;ui.stab="plan";go("student")},
  openReport:el=>{ui.rsid=el.dataset.id;go("report")},
  openProgram:el=>{ui.pid=el.dataset.id;go("program")},
  close:()=>closeModal(),
  backdrop:(el,e)=>{if(e.target===el)closeModal()},
  demo:()=>startDemo(),
  exitDemo:()=>{S=LIVE;MODE=PREV==="loading"?"auth":PREV;ui.view=null;render()},
  day:el=>{ui.date=addDays(ui.date,+el.dataset.n);render()},
  month:el=>{const[y,m]=ui.month.split("-").map(Number);const d=new Date(y,m-1+(+el.dataset.n),15);ui.month=ymd(d).slice(0,7);render()},
  attAll:el=>{const k=el.dataset.cid,v=el.dataset.v||"present";const m=me();let n=0;scoped(m).filter(s=>canAttend(m,s)&&(!k||(s.circleId&&get("circles",s.circleId)?s.circleId:"none")===k)).forEach(s=>{const id=`${s.id}_${ui.date}`;if(!get("logs",id)){n++;patch("logs",id,{studentId:s.id,date:ui.date,teacherId:m.id,attendance:v})}});toast(n?`سُجّل ${ATT[v]} لـ ${n} طالب`:"كل الطلاب مُحضَّرون مسبقاً")},
  circleDay:el=>{ui.circle=el.dataset.id;ui.date=el.dataset.d;go("daily")},
  openCircle:el=>{ui.cid=el.dataset.id;go("circle")},
  newCircle:()=>circleForm(),
  editCircle:el=>circleForm(get("circles",el.dataset.id)),
  delCircle:el=>{if(modalCtx&&modalCtx.confirmDel!==el.dataset.id){modalCtx.confirmDel=el.dataset.id;el.textContent="اضغط مرة أخرى للتأكيد (الطلاب لا يُحذفون)";return}const id=el.dataset.id;circleStudents(id).forEach(s=>patch("members",s.id,{circleId:null}));del("circles",id);closeModal();go("circles")},
  circleDaily:el=>{ui.circle=el.dataset.id;ui.date=today();go("daily")},
  editMsgs:el=>{const s=get("members",el.dataset.id);openModal(`الملاحظات الثابتة: ${esc(s.name)}`,`<p class="hint">ملاحظات تبقى ظاهرة أعلى صفحة الطالب أو ولي الأمر حتى تعدّلها أو تحذفها. لكل يوم ملاحظاته الخاصة في السجل اليومي.</p>${fld("ملاحظة للطالب",`<textarea name="msgStudent" id="f-msgStudent" style="min-height:90px" placeholder="مثال: ركّز هذا الأسبوع على تثبيت سورة الملك قبل الانتقال">${esc(s.msgStudent||"")}</textarea>`,"يراها الطالب فقط")}${fld("ملاحظة لولي الأمر",`<textarea name="msgParent" id="f-msgParent" style="min-height:90px" placeholder="مثال: نرجو متابعة المراجعة في البيت يومياً">${esc(s.msgParent||"")}</textarea>`,"يراها ولي الأمر فقط، ولا تظهر للطالب")}`,"msgs",{sid:s.id})},
  pm:el=>{ui.pm=el.dataset.v;if(ui.pm==="custom"&&!ui.cmode)ui.cmode="month";render()},
  rtype:el=>{ui.rtype=el.dataset.v;render()},
  copyParent:el=>copy(reportText(el.dataset.id,curRange(el.dataset.id),true)),
  copyProgram:el=>copy(programReportText(el.dataset.id)),
  jdelMode:el=>{ui.jdel=ui.jdel===el.dataset.sid?null:el.dataset.sid;render()},
  jdelAll:el=>{const s=get("members",el.dataset.sid);const n=Object.keys((s&&s.hifzMap)||{}).length;if(!n)return;openModal("حذف كل علامات الخريطة",`<p>سيتم مسح علامات <b class="num">${n}</b> جزء من خريطة ${esc(s.name)}.</p><p class="hint">لا يمكن التراجع عن هذا الحذف.</p>`,"jdelAll",{sid:s.id},"تأكيد الحذف")},
  juz:el=>{const s=get("members",el.dataset.sid);const mp={...(s.hifzMap||{})};const j=el.dataset.j;if(ui.jdel===s.id){if(mp[j]==null)return;delete mp[j];patch("members",s.id,{hifzMap:mp});if(!Object.keys(mp).length)ui.jdel=null;return}const nx={undefined:"x",m:"r",x:"r",r:undefined}[mp[j]];if(nx)mp[j]=nx;else delete mp[j];patch("members",s.id,{hifzMap:mp})},
  newExam:el=>examForm(null,el.dataset.sid),
  editExam:el=>examForm(get("exams",el.dataset.id)),
  delExam:el=>{del("exams",el.dataset.id);closeModal()},
  newCert:el=>certForm(el.dataset.sid),
  delCert:el=>{if(modalCtx?.confirmDel!==el.dataset.id&&!el.dataset.ok){el.dataset.ok=1;el.textContent="تأكيد الحذف";return}del("certs",el.dataset.id)},
  certDl:el=>downloadCert(el.dataset.id),
  alertMsg:el=>{const s=get("members",el.dataset.id);const txt=alertMsgText(s,el.dataset.k,el.dataset.n);const num=waNum(s.guardianPhone);
    openModal("رسالة لولي الأمر",`${fld("نص الرسالة",`<textarea id="f-msg" data-input="wa" style="min-height:170px">${esc(txt)}</textarea>`)}<div class="row"><button type="button" class="btn" data-act="copyMsg">نسخ الرسالة</button>${num?`<a id="wa-link" class="btn meet" href="https://wa.me/${num}?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">فتح واتساب</a>`:`<span class="hint">لا يوجد رقم ولي أمر صحيح لهذا الطالب. أضفه من «تعديل البيانات».</span>`}</div>`,"noop",{num},"إغلاق")},
  copyMsg:()=>copy($("#f-msg").value),
  reviewRecit:el=>recitReviewForm(get("recits",el.dataset.id)),
  delRecit:el=>{del("recits",el.dataset.id);closeModal()},
  tatt:el=>{const id=`${el.dataset.id}_${el.dataset.d}`;const cur=get("tatt",id);const order=["present","late","absent","excused"];const i=cur?order.indexOf(cur.status):-1;if(i===order.length-1)del("tatt",id);else put("tatt",id,{teacherId:el.dataset.id,date:el.dataset.d,status:order[i+1],by:me().id})},
  divGo:el=>{ui.div=el.dataset.v;ui.circle="all";ui.teacher="all";try{localStorage.setItem("divSel",ui.div)}catch(e){}render()},
  divNew:()=>divForm(),
  divEdit:el=>divForm(divs().find(d=>d.id===el.dataset.id)),
  divDel:el=>{const d=divs().find(x=>x.id===el.dataset.id);if(!d)return;const st=allStudents().filter(s=>divOfS(s)===d.id).length;openModal(`حذف ${esc(d.name)}`,`<p>سيُحذف ${esc(DT())} «${esc(d.name)}». الطلاب (${st}) والحلقات والبرامج <b>لا تُحذف</b>، وتصبح بدون ${esc(DT())}.</p><p class="hint">هل أنت متأكد؟</p>`,"divDel",{id:d.id},"تأكيد الحذف")},
  logoDel:el=>{saveUi({brand:{...brand(),[el.dataset.k]:""}})},
  idExport:()=>{const U=uiCfg();const d={type:"halaqa-identity",v:1,exported:new Date().toISOString(),ui:{brand:brand(),terms:U.terms||{},replace:U.replace||[],nav:U.nav||null,home:U.home||null,lists:U.lists||null},main:{circleName:cfg().circleName,termName:cfg().termName||"",divTerm:cfg().divTerm||"",divTermPl:cfg().divTermPl||""}};
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,1)],{type:"application/json"}));a.download=`هوية-${(cfg().circleName||"المنصة").replace(/[\\/:*?"<>|]/g,"")}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)},
  idReset:()=>openModal("استعادة الهوية الافتراضية","<p>سيعود الشعار والألوان والخطوط والنصوص التعريفية إلى الإعداد الأصلي. المسميات وترتيب القوائم لا تتغير.</p><p class=\"hint\">تظهر كمعاينة حتى تضغط «حفظ التعديلات».</p>","idReset",{},"تأكيد الاستعادة"),
  clearMarks:()=>{const n=Object.keys(ui.marks).length;if(!n){toast("لا توجد علامات لحذفها");return}openModal("حذف كل العلامات",`<p>سيتم حذف <b class="num">${n}</b> علامة (تنبيه وتلقين) من هذه الجلسة. هل أنت متأكد؟</p><p class="hint">لا يمكن التراجع عن هذا الحذف.</p>`,"clrMarks",{},"تأكيد الحذف")},
  mNav:el=>{const y=scrollY;ui.mpage=Math.min(604,Math.max(1,(ui.mpage||1)+(+el.dataset.n)));render();scrollTo(0,y)},
  mushafFor:el=>{const s=get("members",el.dataset.id);if(s){ui.mstu=s.id;ui.tasmee=true;ui.marks={};const l=logsOf(s.id)[0];ui.msurah=(l&&(l.newSurah||l.tSurah))||(s.plan&&s.plan.startPoint)||null}go("mushaf")},
  saveTasmee:()=>{const s=get("members",ui.mstu);if(!s)return;if(!canAttend(me(),s)){toast("لا تملك صلاحية تسجيل متابعة هذا الطالب","err");return}
    const list=[];Object.entries(ui.marks).forEach(([k,x])=>{if(!x)return;const[g,w]=k.split(":").map(Number);const[si,a]=sa(g);list.push({g,w,c:x.c,h:x.h,t:MT(x.t),word:(wtext(g,w)),sn:Q.s[si][0],a})});
    const id=`${s.id}_${today()}`;const cur=get("logs",id)||{studentId:s.id,date:today(),teacherId:me().id,attendance:"present"};const c0=EC(cur);
    patch("logs",id,{...cur,tanbih:c0.t+list.filter(x=>x.t==="t").length,talqin:c0.l+list.filter(x=>x.t==="l").length,marks:[...(cur.marks||[]),...list]});ui.marks={};ui.mpick=null;toast("حُفظت المواضع في سجل اليوم")},
  resetPerms:el=>{if(!el.dataset.ok){el.dataset.ok=1;el.textContent="اضغط مرة أخرى للتأكيد";return}stageConfig("perms",null)},
  xlsAll:()=>{const d=studentsReportData(me());exportXLSX(`تقرير-الطلاب-${d.f}_${d.t}`,[{name:"الطلاب",title:d.title,sub:d.sub,head:d.head,rows:d.full}])},
  pdfAll:()=>{const d=studentsReportData(me());exportPDF(`تقرير-الطلاب-${d.f}_${d.t}`,{title:d.title,sub:d.sub,summary:d.summary,tables:[{head:d.ph,rows:d.pr}]})},
  xlsOne:el=>{const d=studentReportData(el.dataset.id);exportXLSX(`تقرير-${d.s.name}`,[{name:"المتابعة",title:d.title,sub:d.sub,head:d.head,rows:d.rows},{name:"الملخص",title:d.title,sub:d.sub,head:["البند","القيمة"],rows:d.summary},...(d.er.length?[{name:"الاختبارات",title:d.title,sub:d.sub,head:d.eh,rows:d.er}]:[])])},
  pdfOne:async el=>{await ensureMQ();if(!Q)await ensureQ();const d=studentReportData(el.dataset.id);exportPDF(`تقرير-${d.s.name}`,{title:d.title,sub:d.sub,summary:d.summary,tables:reportTables(d)},{share:!!el.dataset.share,text:`تقرير ${d.s.name} — ${cfg().circleName}`})},
  pdfCards:async()=>{await ensureMQ();if(!Q)await ensureQ();const m=me();const st=scoped(m);if(!st.length){toast("لا طلاب","err");return}const[f,t]=curRange();const T=[];
    st.forEach((s,i)=>{const d=studentReportData(s.id);T.push({newPage:i>0,banner:s.name,bannerSub:d.sub,head:d.summary.map(x=>x[0]),rows:[d.summary.map(x=>String(x[1]))]});reportTables(d).forEach(tb=>T.push(tb))});
    exportPDF(`تقارير-الطلاب-${f}_${t}`,{title:"التقارير الفردية للطلاب",sub:`${st.length} طالباً · ${periodLabel([f,t])}`,tables:T})},
  xlsProg:el=>{const d=programReportData(el.dataset.id);exportXLSX(d.title,[{name:"البرنامج",title:d.title,sub:d.sub,head:d.head,rows:d.rows}])},
  pdfProg:el=>{const d=programReportData(el.dataset.id);exportPDF(d.title,{title:d.title,sub:d.sub,tables:[{head:d.head,rows:d.rows}]})},
  ctab:el=>{ui.ctab=el.dataset.v;render()},
  asPick:()=>{ui.asId=ui.asId||"";const r=realMe();const opts=S.members.filter(x=>x.status==="active"&&x.id!==(r&&r.id));const groups={};opts.forEach(x=>{(groups[x.role]=groups[x.role]||[]).push(x)});openModal("عرض الواجهة بصفة",`<p class="hint">اختر أي شخص لتشاهد واجهته كما يراها، وتعدّل ترتيبها وشكلها. أنت ما زلت مسجّلاً كمدير.</p>${Object.entries(groups).map(([role,list])=>`<div class="card" style="padding:10px"><b>${esc(ROLE[role]||role)}</b><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">${list.slice(0,60).map(x=>`<button type="button" class="btn sm" data-act="asGo" data-id="${x.id}">${esc(x.name)}</button>`).join("")}</div></div>`).join("")||empty("لا أعضاء بعد.")}`,"noop",{},"إغلاق")},
  asGo:el=>asApply(el.dataset.id),
  asRole:el=>asRole(el.dataset.r),
  asExit:()=>asApply(null),
  feToggle:()=>{ui.freeEdit=!ui.freeEdit;ui.feSel=null;ui.feMulti=null;if(!ui.freeEdit&&!ui.homeEdit)ui.editDev=null;document.body.classList.toggle("free-edit",ui.freeEdit);render()},
  feClose:()=>{ui.feSel=null;ui.feMulti=null;document.querySelectorAll(".fe-on").forEach(x=>x.classList.remove("fe-on"));const p=document.getElementById("fe-panel");if(p)p.remove()},
  feNudge:el=>setFreeMany((b,v)=>({x:(+v.x||0)+(+el.dataset.dx),y:(+v.y||0)+(+el.dataset.dy)})),
  feFs:el=>setFreeMany((b,v)=>{const n=feElOf(b);const cur=v.fs||(n?Math.round(parseFloat(getComputedStyle(n).fontSize)):16);return {fs:Math.max(8,cur+(+el.dataset.n))}}),

  feFw:el=>setFreeMany(()=>({fw:el.dataset.v?+el.dataset.v:""})),
  feClr:el=>setFreeMany(()=>({[el.dataset.p]:""})),
  feHide:()=>{const h=!feVal().hide;setFreeMany(()=>({hide:h}))},
  feReset:()=>{const d=design();const F={...(d.free||{})};feSet().forEach(b=>delete F[feKeyOf(b)]);setDesign({free:F})},
  feScopeSet:el=>{ui.feScope=el.dataset.v;feApplyText()},
  uhUndo:()=>uhDo(-1),uhRedo:()=>uhDo(1),
  feFmtCopy:()=>{const v=feVal();const o={};["fs","fw","c","bg","w","h"].forEach(k=>{if(v[k]!=null&&v[k]!=="")o[k]=v[k]});window.__feFmt=o;toast(Object.keys(o).length?"نُسخ التنسيق — حدّد عنصراً آخر واضغط «لصق التنسيق»":"هذا العنصر بلا تنسيق مخصص")},
  feFmtPaste:()=>{const o=window.__feFmt;if(!o||!Object.keys(o).length){toast("انسخ تنسيق عنصر أولاً","err");return}setFreeMany(()=>({...o}))},
  cmpToggle:()=>{ui.cmp=!ui.cmp;render()},
  snapSave:()=>{const n=(document.getElementById("snap-name")||{}).value||"";if(!n.trim()){toast("اكتب اسماً للنسخة","err");return}const c={...uiCfg()};delete c.snaps;delete c.log;delete c.id;const js=JSON.stringify(c);if(js.length>500000){toast("التصميم كبير جداً (صور كثيرة) — احذف بعض الصور","err");return}const sn=[...(uiCfg().snaps||[]),{n:n.trim(),at:Date.now(),data:JSON.parse(js)}].slice(-12);saveUi({snaps:sn});toast("حُفظت النسخة. اضغط «حفظ التعديلات» لتثبيتها")},
  snapLoad:el=>{const c=uiCfg();const s=(c.snaps||[])[+el.dataset.i];if(!s)return;stageConfig("ui",{...JSON.parse(JSON.stringify(s.data)),snaps:c.snaps,log:c.log});toast("استُرجعت «"+s.n+"» كمعاينة — اضغط «حفظ التعديلات» لتطبيقها")},
  snapDel:el=>{const sn=[...(uiCfg().snaps||[])];sn.splice(+el.dataset.i,1);saveUi({snaps:sn})},
  parentMsg:el=>parentMsgModal(el.dataset.id),
  pmCopy:el=>{const t=document.getElementById("pm-"+el.dataset.i);if(t)copy(t.value)},
  pmWa:el=>{const t=document.getElementById("pm-"+el.dataset.i);if(t)window.open("https://wa.me/"+el.dataset.p+"?text="+encodeURIComponent(t.value),"_blank","noopener")},
  zadHome:()=>{ui.ztab="pray";ui.zch=null;ui.view="zad";render();scrollTo(0,0)},zadTab:el=>{ui.ztab=el.dataset.v;ui.zch=null;render();scrollTo(0,0)},
  zadCh:el=>{ui.view="zad";ui.ztab="adhkar";ui.zch=+el.dataset.id;render();scrollTo(0,0)},
  zadBack:()=>{ui.zch=null;render()},
  zadCat:el=>{ui.zcat=el.dataset.v;render()},
  zadFadl:el=>zFadlModal(el.dataset.id),zadDkN:el=>{const D=zls.get("dkn",{});D[el.dataset.id]=+el.dataset.v;zls.set("dkn",D);zRerender()},
  zadTap:el=>{const k="cnt:"+zYmd(new Date());const c=zls.get(k,{});const id=el.dataset.id,n=+el.dataset.n||1;c[id]=Math.min(n,(c[id]||0)+1);zls.set(k,c);try{navigator.vibrate&&navigator.vibrate(c[id]>=n?[20,40,20]:12)}catch(e){}render()},
  zadCntReset:el=>{const k="cnt:"+zYmd(new Date());const c=zls.get(k,{});const L=ZST.ch[el.dataset.id];if(Array.isArray(L))L.forEach(x=>delete c[x.id]);zls.set(k,c);render()},
  zadGeo:()=>zGeo(false),
  zadTest:()=>{const n=zNext();zAdhan(n?n.k:"dhuhr")},
  zadRefresh:()=>{zls.set("pt",null);ZST.ptKey="";zLoadPT(true);toast("جاري تحديث المواقيت…")},
  zadHSearch:()=>{const i=document.getElementById("zad-hq");zHSearch(i&&i.value)},
  zadHTopic:el=>zHSearch(el.dataset.v),
  zadHSrc:el=>{const S=zHSel().slice();const v=el.dataset.v;const i=S.indexOf(v);if(i>=0){if(S.length>1)S.splice(i,1)}else S.push(v);ui.zhSrc=S;if(ui.zhq)zHSearch(ui.zhq);else render()},
  zadHMore:()=>{ui.zhLim=(ui.zhLim||30)+30;render()},
  zadDTog:el=>{const D=zDData();const td=zYmd(new Date());const s=D.days[td]=D.days[td]||{};const k=el.dataset.k;if(s[k])delete s[k];else s[k]=1;const ks=Object.keys(D.days).sort();while(ks.length>120)delete D.days[ks.shift()];zls.set("d:"+zUid(),D);render()},
  zadDEdit:()=>{const D=zDData();ui.zdDraft={custom:D.custom.map(x=>[...x]),hidden:[...D.hidden],trash:(D.trash||[]).map(x=>[...x])};ui.zdEdit=true;render()},
  zadDSave:()=>{const R=ui.zdDraft;if(!R){ui.zdEdit=false;render();return}const D=zDData();D.custom=R.custom;D.hidden=R.hidden;D.trash=R.trash.slice(-30);zls.set("d:"+zUid(),D);ui.zdEdit=false;ui.zdDraft=null;toast("حُفظت تعديلات القائمة");render()},
  zadDCancel:()=>{ui.zdEdit=false;ui.zdDraft=null;render()},
  zadDUnhide:el=>{const R=ui.zdDraft;if(!R)return;R.hidden=R.hidden.filter(k=>k!==el.dataset.k);render()},
  zadDUntrash:el=>{const R=ui.zdDraft;if(!R)return;const i=R.trash.findIndex(x=>x[0]===el.dataset.k);if(i>=0){R.custom.push(R.trash[i]);R.trash.splice(i,1)}render()},
  zadDAdd:()=>{const i=document.getElementById("zad-dnew");const v=((i&&i.value)||"").trim();if(!v){toast("اكتب اسم العمل","err");return}if(!ui.zdDraft)A.zadDEdit();ui.zdDraft.custom.push(["c"+Date.now().toString(36),v.slice(0,60)]);render()},
  zadDDel:el=>{const R=ui.zdDraft;if(!R)return;const k=el.dataset.k;if(el.dataset.c){const x=R.custom.find(y=>y[0]===k);R.custom=R.custom.filter(y=>y[0]!==k);if(x)R.trash.push(x)}else if(!R.hidden.includes(k))R.hidden.push(k);render()},
  zadDRestore:()=>{const R=ui.zdDraft;if(!R)return;R.hidden=[];R.custom.push(...R.trash);R.trash=[];render()},
  khPick:el=>{ui.khD=el.dataset.v==="c"?"c":+el.dataset.v;render()},
  khStart:el=>{const st=(document.getElementById("kh-start")||{}).value||today();const kc=el.closest(".kh")&&el.closest(".kh").querySelector(".khc");const K=ui.khD==="c"&&kc?khRead(kc):{start:st,days:ui.khD||30};const s=get("members",el.dataset.id);if(!s)return;if(el.dataset.st){put("members",s.id,{...s,plan:{...(s.plan||{}),khatma:K}});toast("اعتُمدت الختمة للطالب")}else{zls.set("kh:"+s.id,K);toast("بدأت ختمتك، وفقك الله")}render()},
  khApprove:el=>{const s=get("members",el.dataset.id);const K=s&&khCfg(s);if(!K)return;put("members",s.id,{...s,plan:{...(s.plan||{}),khatma:(({official,...k})=>k)(K)}});toast("اعتُمد الجدول للطالب")},
  khReset:el=>{const s=get("members",el.dataset.id);if(!s)return;if(!confirm("بدء ختمة جديدة؟ سيُلغى الجدول الحالي."))return;zls.set("kh:"+s.id,null);if(el.dataset.st&&s.plan&&s.plan.khatma){const p={...s.plan};delete p.khatma;put("members",s.id,{...s,plan:p})}render()},
  khTick:el=>{const s=get("members",el.dataset.id);const K=s&&khCfg(s);if(!K)return;const k="khm:"+s.id+":"+K.start;const M=zls.get(k,{});const i=el.dataset.i;if(M[i])delete M[i];else M[i]=1;zls.set(k,M);render()},
  khAll:()=>{ui.khAll=!ui.khAll;render()},
  khCopy:el=>{const s=get("members",el.dataset.id);const K=s&&khCfg(s);if(!K)return;const L=khRows(K).map(r=>{const a=khSurahAt(r.from),b=khEndSurah(r.to);return `اليوم ${r.i} (${fmtShort(r.date)}): ص ${r.from}–${r.to}${a&&b?` · من ${a.s} ${a.a} إلى ${b.s} ${b.a}`:""}`});copy(`جدول ختمة ${s.name} — ${L.length} يوماً\n`+L.join("\n"))},
  feShadow:el=>setFreeMany(()=>({sh:el.dataset.v})),
  feShapeReset:()=>setFreeMany(()=>({br:"",bw:"",bc:"",sh:"",op:""})),
  feIcNudge:el=>{const dx=+el.dataset.dx,dy=+el.dataset.dy;setFreeMany((b,v)=>({icx:(+v.icx||0)+dx,icy:(+v.icy||0)+dy}))},
  feIcReset:()=>setFreeMany(()=>({ics:"",icr:"",icc:"",icbg:"",icx:"",icy:""})),
  feIcBgNone:()=>setFreeMany(()=>({icbg:"transparent"})),
  selfWird:()=>selfWirdForm(),
  selfReview:el=>selfReviewForm(get("recits",el.dataset.id)),
  selfReject:el=>{const r=get("recits",el.dataset.id);if(!r)return;const fb=(document.getElementById("f-feedback")||{}).value||"";put("recits",r.id,{...r,status:"reviewed",rejected:true,confirmed:false,feedback:fb||"يرجى إعادة التسميع",reviewedAt:new Date().toISOString()});closeModal();toast("أُرجع للطالب")},
  rOpen:()=>rOpen(ui.mpage||1),
  fePos:el=>{feSavePos({mode:el.dataset.v});feApplyText()},
  feIc:el=>{const k=el.dataset.v;setFreeMany(()=>({ic:k==="auto"?"":k}))},
  feSizeClr:()=>setFreeMany(()=>({w:"",h:"",zm:""})),
  fePart:el=>{const src=document.querySelector("#fe-panel .fe-src");const col=(document.querySelector("#fe-panel .fe-pc")||{}).value||"#f5c547";const v=feVal();const parts=[...(v.parts||[])];
    if(el.dataset.k==="digits"){const i=parts.findIndex(p=>p.re==="digits");const np={re:"digits",c:col};if(i>=0)parts[i]=np;else parts.push(np)}
    else{const a=src?src.selectionStart:0,b=src?src.selectionEnd:0;const t=src?src.value.slice(a,b):"";if(!t.trim()){toast("حدّد جزءاً من النص أولاً داخل المربع","err");return}const i=parts.findIndex(p=>p.s===t);const old=i>=0?parts[i]:{s:t};const np=el.dataset.k==="b"?{...old,fw:old.fw?"":800}:{...old,c:col};if(i>=0)parts[i]=np;else parts.push(np)}
    setFreeOne({parts})},
  fePartDel:el=>{const v=feVal();const parts=[...(v.parts||[])];parts.splice(+el.dataset.i,1);setFreeOne({parts})},
  feMin:()=>{ui.feMin=!ui.feMin;feApplyText()},

  hbEdit:el=>{ui.homeEdit=el.dataset.g||null;if(!ui.homeEdit&&!ui.freeEdit)ui.editDev=null;render()},
  devSet:el=>{ui.editDev=el.dataset.v;ui.feScope=null;render();if(ui.freeEdit)feApplyText()},
  hbScope:el=>{const g=el.dataset.g,v=el.dataset.v,K=devKey();if(v==="dev"){if(!hasOv(g)){const items=homeOrder(g);const o={...(uiCfg()[K]||{})};o[g]=items.map(x=>({k:x.k,...(x.h?{h:true}:{}),...(x.w?{w:x.w}:{}),...(x.hh?{hh:x.hh}:{}),...(x.sz?{sz:x.sz}:{}),...(x.st?{st:true}:{})}));ui.layScope="dev";saveUi({[K]:o});toast("صار ترتيب "+devName()+" مستقلاً. تعديلاتك الآن تطبّق على "+devName()+" فقط")}else{ui.layScope="dev";render()}}
    else{if(hasOv(g)){if(!el.dataset.ok){el.dataset.ok=1;el.textContent="تأكيد: يرجع "+devName()+" للترتيب المشترك";return}const o={...(uiCfg()[K]||{})};delete o[g];ui.layScope="both";saveUi({[K]:o})}else{ui.layScope="both";render()}}},
  hbMove:el=>{const g=el.dataset.g;const items=homeOrder(g);const i=items.findIndex(x=>x.k===el.dataset.k),j=i+(+el.dataset.n);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];hbSave(g,items)},
  hbHide:el=>{const g=el.dataset.g;const items=homeOrder(g);const x=items.find(y=>y.k===el.dataset.k);if(!x)return;x.h=!x.h;hbSave(g,items);if($("#modal .dlg"))closeModal()},
  hbH0:el=>{const g=el.dataset.g;const items=homeOrder(g);const x=items.find(y=>y.k===el.dataset.k);if(!x)return;delete x.hh;hbSave(g,items)},
  hbAdd:el=>hbModal(el.dataset.g),
  hbEditC:el=>hbModal(el.dataset.g,homeCustom(el.dataset.g).find(c=>c.id===el.dataset.id)),
  hbDelC:el=>{if(!el.dataset.ok){el.dataset.ok=1;el.textContent="تأكيد الحذف؟";return}const g=el.dataset.g;const HC={...(uiCfg().homeCustom||{})};HC[g]=homeCustom(g).filter(c=>c.id!==el.dataset.id);const home={...(uiCfg().home||{})};home[g]=(home[g]||[]).filter(x=>x.k!=="cx:"+el.dataset.id);saveUi({homeCustom:HC,home})},

  dzSet:el=>setDesign({[el.dataset.k]:el.dataset.v}),
  dzTpl:el=>{const t=DESIGN_TPLS.find(x=>x[0]===el.dataset.v);if(t)setDesign({...t[3],tpl:t[0]},true)},
  dzReset:()=>setDesign({tpl:"maeen"},true),
  dzRole:el=>{const v=el.dataset.v;if(!v)ui.dzRoles=[];else{const S=Array.isArray(ui.dzRoles)?ui.dzRoles.slice():[];const i=S.indexOf(v);if(i>=0)S.splice(i,1);else S.push(v);ui.dzRoles=S}render()},
  dzRoleClr:()=>{const b=brand();const cur=b.design||{};const BR={...(cur.byRole||{})};(ui.dzRoles||[]).forEach(r=>delete BR[r]);saveUi({brand:{...b,design:{...cur,byRole:BR}}});toast("أُزيل التخصيص الخاص")},
  feRoleSet:el=>{const v=el.dataset.v;if(v==="one")ui.feRoles=null;else if(v==="all")ui.feRoles="all";else if(v==="pick")ui.feRoles=Array.isArray(ui.feRoles)?ui.feRoles:[];else{const S=Array.isArray(ui.feRoles)?ui.feRoles.slice():[];const i=S.indexOf(v);if(i>=0)S.splice(i,1);else S.push(v);ui.feRoles=S}feApplyText()},
  dzComp:el=>{ui.dzComp=el.dataset.v;render()},
  dzcSet:el=>setComp(el.dataset.c,el.dataset.p,el.dataset.v),
  dzcClr:el=>setComp(el.dataset.c,el.dataset.p,""),
  dzcReset:el=>{const d=design();const C={...(d.comp||{})};delete C[el.dataset.c];setDesign({comp:C})},
  dzSaveTpl:()=>{const n=(($("#dz-tname")||{}).value||"").trim()||("قالب "+((brand().myTpls||[]).length+1));const b=brand();const T=[...(b.myTpls||[])].filter(x=>x.n!==n);T.push({n,d:{...design(),tpl:"my"}});saveUi({brand:{...b,myTpls:T.slice(-30)}});toast("حُفظ القالب «"+n+"». اضغط «حفظ التعديلات» ليُحفظ للجميع")},
  dzMyApply:el=>{const t=(brand().myTpls||[])[+el.dataset.i];if(t)setDesign({...t.d,tpl:"my"},true)},
  dzMyDel:el=>{const b=brand();const T=[...(b.myTpls||[])];T.splice(+el.dataset.i,1);saveUi({brand:{...b,myTpls:T}})},
  dzExport:()=>openModal("تصدير التصميم",`<p class="hint">انسخ هذا النص واحفظه، أو الصقه في «استيراد تصميم» في أي منصة أخرى.</p><textarea dir="ltr" readonly style="min-height:220px;font-family:monospace" onclick="this.select()">${esc(JSON.stringify({type:"maeen-design",design:design()}))}</textarea>`,"noop",{},"تم"),
  dzImport:()=>openModal("استيراد تصميم",`<p class="hint">الصق نص التصميم المصدَّر هنا.</p><textarea name="json" dir="ltr" required style="min-height:220px;font-family:monospace"></textarea>`,"dzImport",{},"استيراد"),
  homeW:el=>{const g=el.dataset.g;const items=homeOrder(g);const x=items.find(y=>y.k===el.dataset.k);if(!x)return;x.w=x.full?"half":"full";x.full=!x.full;saveHome(g,items)},
  navMove:el=>{const r=el.dataset.r;const items=roleNavItems(r);const i=items.findIndex(x=>x.k===el.dataset.k),j=i+(+el.dataset.n);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];saveNav(r,items)},
  navReset:el=>{const nav={...(uiCfg().nav||{})};delete nav[el.dataset.r];saveUi({nav});},
  homeMove:el=>{const g=el.dataset.g;const items=homeOrder(g);const i=items.findIndex(x=>x.k===el.dataset.k),j=i+(+el.dataset.n);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];saveHome(g,items)},
  homeReset:el=>{const g=el.dataset.g;const K=(typeof layScope==="function"&&layScope(g)==="dev")?devKey():"home";const home={...(uiCfg()[K]||{})};delete home[g];saveUi({[K]:home})},
  termsReset:el=>{if(!el.dataset.ok){el.dataset.ok=1;el.textContent="اضغط مرة أخرى للتأكيد";return}saveUi({terms:{}});},
  replAdd:()=>{saveUi({replace:[...(uiCfg().replace||[]),["",""]]})},
  replDel:el=>{const L=[...(uiCfg().replace||[])];L.splice(+el.dataset.i,1);saveUi({replace:L})},
  colorsReset:()=>{saveUi({brand:{...brand(),primary:"",accent:"",bg:"",surface:"",header:"",light:{},dark:{},darkAuto:true}})},
  cmodeTab:el=>{ui.cmodeTab=el.dataset.v;setThemeMode(el.dataset.v)},
  tokClear:el=>{const b=brand();const m=el.dataset.m,k=el.dataset.k;const t={...(b[m]||{})};delete t[k];const patch={[m]:t};if(m==="light"&&["primary","accent","bg","surface","header"].includes(k))patch[k]="";saveUi({brand:{...b,...patch}})},
  fontGoogle:()=>{const n=cssName(($("#cf-name")||{}).value);if(!n){toast("اكتب اسم الخط أولاً","err");return}const b=brand();const cf=[...(b.customFonts||[])].filter(f=>cssName(f.name)!==n);cf.push({name:n,google:true});saveUi({brand:{...b,customFonts:cf,fontBody:n}});toast("أُضيف الخط. إذا لم يتغير الشكل فتأكد من كتابة الاسم كما في Google Fonts")},
  fontDel:el=>{const b=brand();const cf=[...(b.customFonts||[])];const [d]=cf.splice(+el.dataset.i,1);const n=d?cssName(d.name):"";saveUi({brand:{...b,customFonts:cf,fontBody:b.fontBody===n?"":b.fontBody,fontHead:b.fontHead===n?"":b.fontHead}})},
  brandClear:el=>{saveUi({brand:{...brand(),[el.dataset.k]:""}})},
  fontsReset:()=>{saveUi({brand:{...brand(),fontBody:"",fontHead:"",fontScale:1}})},
  fontScale:el=>{saveUi({brand:{...brand(),fontScale:Number(el.dataset.v)}})},
  pickFont:el=>{saveUi({brand:{...brand(),fontBody:el.dataset.v,fontV:2}})},
  myNav:()=>myNavModal(),
  myNavMove:el=>{const items=[...modalCtx.items];const i=+el.dataset.i,j=i+(+el.dataset.n);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];myNavModal(items)},
  myNavReset:()=>{patch("members",me().id,{navPref:[]});closeModal();toast("أُعيد الترتيب الافتراضي")},
  saveDrafts:()=>saveDrafts(),
  discardDrafts:()=>discardDrafts(),
  themeToggle:()=>{setThemeMode(isDark()?"light":"dark")},
  themeSet:el=>setThemeMode(el.dataset.v),
  colorPreset:el=>{const p=COLOR_PRESETS.find(x=>x[0]===el.dataset.v);if(p){const b=brand();saveUi({brand:{...b,primary:p[2],accent:p[3],light:{...(b.light||{}),primary:p[2],accent:p[3]}}})}},
  ptab:el=>{ui.ptab=el.dataset.v;render()},
  wk:el=>{const n=+el.dataset.n;ui.wk=n?addDays(ui.wk||addDays(today(),-dow(today())),n):null;render()},
  newTaskAt:el=>taskForm({date:el.dataset.d,kind:"program"},el.dataset.sid),
  backup:()=>{const data={app:"halaqa",version:1,exportedAt:new Date().toISOString(),circleName:cfg().circleName,collections:{}};COLS.forEach(c=>data.collections[c]=S[c]);saveBlob(`نسخة-احتياطية-${today()}.json`,new Blob([JSON.stringify(data,null,1)],{type:"application/json"}));toast("جاري تجهيز النسخة الاحتياطية…")},
  kid:el=>{ui.kid=el.dataset.id;render()},
  dmode:el=>{ui.dmode=el.dataset.v;render()},
  att:el=>{if(!canAttend(me(),get("members",el.dataset.id))){toast("لا تملك صلاحية تحضير هذا الطالب","err");return}const sid=el.dataset.id,id=`${sid}_${ui.date}`;const cur=get("logs",id);if(cur&&cur.attendance===el.dataset.v)return;patch("logs",id,{studentId:sid,date:ui.date,teacherId:me().id,attendance:el.dataset.v})},
  logFor:el=>{const sid=el.dataset.id;if(!canAttend(me(),get("members",sid))){toast("لا تملك صلاحية تسجيل متابعة هذا الطالب","err");return}const d=ui.view==="daily"?ui.date:today();logForm(sid,d,get("logs",`${sid}_${d}`))},
  editLog:el=>{const l=get("logs",el.dataset.id);logForm(l.studentId,l.date,l)},
  delLog:el=>{del("logs",el.dataset.id);closeModal();toast("حُذف السجل")},
  toggleTask:el=>{const t=get("tasks",el.dataset.id);patch("tasks",t.id,{done:!t.done,doneAt:!t.done?new Date().toISOString():null});if(t.programId&&t.lessonId){const pid=`${t.studentId}__${t.programId}`;const d=progOf(t.studentId,t.programId);const nd=!t.done?[...new Set([...d,t.lessonId])]:d.filter(x=>x!==t.lessonId);put("progress",pid,{studentId:t.studentId,programId:t.programId,done:nd})}if(!t.done&&me().role==="student"){const T=tasksOf(t.studentId,t.date,t.date);if(t.date===today()&&T.length&&T.every(z=>z.id===t.id||z.done))celebrate("ما شاء الله! أنجزت كل مهام اليوم");else toast("بارك الله فيك! أُنجزت المهمة")}},
  newTask:el=>taskForm(null,el.dataset.sid),
  editTask:el=>taskForm(get("tasks",el.dataset.id)),
  delTask:el=>{del("tasks",el.dataset.id);closeModal()},
  genWeek:el=>genWeek(el.dataset.id,el.dataset.n==="all"?"all":+el.dataset.n||7),
  revPick:el=>{const f=el.closest("form");if(!f)return;const v=+el.dataset.v;const n=f.querySelector('[name="revN"]'),u=f.querySelector('[name="revU"]');if(v%15===0){n.value=v/15;u.value="page"}else{n.value=v;u.value="line"}f.querySelectorAll(".qrev .chip-b").forEach(b=>b.classList.toggle("on",b===el));planEstUpd()},
  amtPick:el=>{const f=el.closest("form");if(!f)return;const v=+el.dataset.v;const n=f.querySelector('[name="amtN"]'),u=f.querySelector('[name="amtU"]');if(v>=15&&v%7.5===0&&v!==7.5){n.value=v/15;u.value="page"}else if(v===7.5){n.value=.5;u.value="page"}else{n.value=v;u.value="line"}f.querySelectorAll(".qamt .chip-b").forEach(b=>b.classList.toggle("on",b===el));planEstUpd()},
  editPlan:el=>planForm(get("members",el.dataset.id)),
  newSession:el=>{modalPresetCircle=el.dataset.cid||"";sessionForm(null,el.dataset.sid||(ui.view==="student"?ui.sid:""));modalPresetCircle=""},
  editSession:el=>sessionForm(get("sessions",el.dataset.id)),
  delSession:el=>{del("sessions",el.dataset.id);closeModal()},
  newProgram:()=>programForm(),
  editProgram:el=>programForm(get("programs",el.dataset.id)),
  delProgram:el=>{if(modalCtx&&modalCtx.confirmDel!==el.dataset.id){modalCtx.confirmDel=el.dataset.id;el.textContent="اضغط مرة أخرى لتأكيد الحذف";return}del("programs",el.dataset.id);closeModal();go("programs")},
  newLesson:el=>lessonForm(el.dataset.id),
  editLesson:el=>lessonForm(el.dataset.pid,(get("programs",el.dataset.pid).lessons||[]).find(l=>l.id===el.dataset.id)),
  delLesson:el=>{const p=get("programs",el.dataset.pid);patch("programs",p.id,{lessons:(p.lessons||[]).filter(l=>l.id!==el.dataset.id)});closeModal()},
  lessonDone:el=>{const m=me(),id=`${m.id}__${el.dataset.pid}`;const d=progOf(m.id,el.dataset.pid);const nd=d.includes(el.dataset.id)?d.filter(x=>x!==el.dataset.id):[...d,el.dataset.id];put("progress",id,{studentId:m.id,programId:el.dataset.pid,done:nd})},
  addStudent:()=>memberForm(null,"student"),
  addMember:()=>memberForm(null,"teacher"),
  editMember:el=>memberForm(get("members",el.dataset.id)),
  approve:el=>{const x=get("members",el.dataset.id);const m=me();if(x.role==="student"&&!can(m,"members.manage")){patch("members",x.id,{status:"active",teacherId:m.id});toast("اعتُمد الطالب وأُسند إليك");return}memberForm(x)},
  delMember:el=>{const x=get("members",el.dataset.id);if(modalCtx&&modalCtx.confirmDel!==x.id){modalCtx.confirmDel=x.id;el.textContent="اضغط مرة أخرى للتأكيد";return}del("members",x.id);closeModal();toast("حُذف العضو")},
  csv:async()=>{const m=me();const[f,t]=curRange();const head=["الطالب","المسار","الحلقة","المعلم","نسبة الحضور","حاضر","متأخر","غائب","مستأذن","حفظ جديد (وجه)","مراجعة (وجه)","تلاوة (وجه)","تنبيهات","تلقين","متوسط التقدير","مهام منجزة","إجمالي المهام","جلسات تسميع","النقاط","إجمالي المحفوظ/المقروء"];
    const rows=scoped(m).map(s=>{const x=stats(s.id,f,t);return[s.name,TRACK[s.track],(get("circles",s.circleId)||{}).name||"",nameOf(s.teacherId),x.rate??"",x.att.present,x.att.late,x.att.absent,x.att.excused,x.newPages,x.revPages,x.tPages,x.errT,x.errL,x.avg?x.avg.toFixed(2):"",x.done,x.tasks,x.sess,x.points,totalPages(s)]});
    const csv="﻿"+[head,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    if(DL){try{await DL.save({filename:`تقرير-${f}_${t}.csv`,data:new Blob([csv],{type:"text/csv"})});return}catch(e){if(e&&e.code==="declined")return}}
    copy(csv.slice(1));},
  copyAll:()=>{copy(scoped(me()).map(s=>reportText(s.id,curRange(s.id))).join("\n\n———\n\n"))},
  copyOne:el=>copy(reportText(el.dataset.id,curRange(el.dataset.id),me().role==="parent")),
};
const CH={
  demoAs:el=>{ui.demoAs=el.value;ui.view=null;render()},
  teacher:el=>{ui.teacher=el.value;render()},
  track:el=>{ui.track=el.value;render()},
  date:el=>{if(el.value){ui.date=el.value;render()}},
  month:el=>{if(el.value){ui.month=el.value;ui.cmode="month";render()}},
  pfrom:el=>{ui.from=el.value;ui.cmode="range";render()},
  pto:el=>{ui.to=el.value;ui.cmode="range";render()},
  crole:el=>{ui.crole=el.value;render()},
  chome:el=>{ui.chome=el.value;render()},
  navLabel:el=>{const r=el.dataset.r;const items=roleNavItems(r);const it=items.find(x=>x.k===el.dataset.k);it.l=el.value.trim()||it.dl;saveNav(r,items)},
  navShow:el=>{const r=el.dataset.r;const items=roleNavItems(r);items.find(x=>x.k===el.dataset.k).h=!el.checked;saveNav(r,items)},
  homeShow:el=>{const g=el.dataset.g;const items=homeOrder(g);items.find(x=>x.k===el.dataset.k).h=!el.checked;saveHome(g,items)},
  term:el=>{const T=JSON.parse(JSON.stringify(uiCfg().terms||{}));const d=el.dataset.d;T[d]=T[d]||{};const v=el.value.trim();if(v)T[d][el.dataset.k]=v;else delete T[d][el.dataset.k];saveUi({terms:T})},
  repl:el=>{const L=(uiCfg().replace||[]).map(r=>[...r]);L[+el.dataset.i][+el.dataset.f]=el.value;saveUi({replace:L})},
  listTaj:el=>{saveUi({lists:{...(uiCfg().lists||{}),tajweed:el.value.split("\n").map(x=>x.trim()).filter(Boolean)}});},
  listCert:el=>{saveUi({lists:{...(uiCfg().lists||{}),certs:el.value.split("\n").map(x=>x.trim()).filter(Boolean)}});},
  brand:el=>{saveUi({brand:{...brand(),[el.dataset.k]:el.value.trim()}})},
  brandLogo:el=>{saveUi({brand:{...brand(),hideLogo:el.checked}})},
  bpAll:el=>{document.querySelectorAll('#modal input[name="sids"]').forEach(x=>x.checked=el.checked)},
  tplPickR:()=>{},
  mHeat:el=>{ui.mheat=el.value||null;if(ui.mheat){ui.tasmee=false;const top=heatPages(heatMap(ui.mheat))[0];if(top&&!heatPages(heatMap(ui.mheat)).some(x=>x[0]===ui.mpage))ui.mpage=top[0]}render()},
  ownerMode:el=>{const cur=get("config","main")||{};put("config","main",{...DEF_CFG,...cur,ownerMode:el.checked});if(el.checked)toast("فُعّلت لوحة المالك")},
  divSel:el=>{ui.div=el.value;ui.circle="all";ui.teacher="all";try{localStorage.setItem("divSel",ui.div)}catch(e){}render()},
  divTermIn:el=>{const cur=get("config","main")||{};put("config","main",{...DEF_CFG,...cur,[el.dataset.k]:el.value.trim()})},
  brandName:el=>{const cur=get("config","main")||{};stageConfig("main",{...DEF_CFG,...cur,circleName:el.value.trim()||DEF_CFG.circleName})},
  logoUp:async el=>{const f=el.files&&el.files[0];const k=el.dataset.k;el.value="";if(!f)return;if(!/^image\//.test(f.type)){toast("اختر صورة","err");return}
    try{const url=await fitImg(f,k==="logoFull"?560:256);if(url.length>700000){toast("الصورة كبيرة جداً، جرّب صورة أصغر","err");return}saveUi({brand:{...brand(),[k]:url}});toast("تمت المعاينة. اضغط «حفظ التعديلات» لتظهر للجميع")}catch(e){toast("تعذّرت قراءة الصورة","err")}},
  idImport:async el=>{const f=el.files&&el.files[0];el.value="";if(!f)return;try{const d=JSON.parse(await f.text());if(!d||d.type!=="halaqa-identity"||!d.ui)throw 0;
    const U={...uiCfg()};["brand","terms","replace","nav","home","lists"].forEach(k=>{if(d.ui[k]!=null)U[k]=d.ui[k]});if(U.brand){["logoMark","logoFull"].forEach(k=>{if(U.brand[k]&&!okLogo(U.brand[k]))delete U.brand[k]})}stageConfig("ui",U);
    if(d.main){const cur=get("config","main")||{};const M={...DEF_CFG,...cur};["circleName","termName","divTerm","divTermPl"].forEach(k=>{if(typeof d.main[k]==="string")M[k]=d.main[k]});stageConfig("main",M)}
    toast("طُبّقت الهوية كمعاينة. اضغط «حفظ التعديلات» لاعتمادها")}catch(e){toast("الملف ليس ملف هوية صالحاً","err")}},
  tokSet:el=>{if(!HEX.test(el.value))return;const b=brand();const m=el.dataset.m,k=el.dataset.k;const t={...(b[m]||{}),[k]:el.value};const patch={[m]:t};if(m==="light"&&["primary","accent","bg","surface","header"].includes(k))patch[k]=el.value;saveUi({brand:{...b,...patch}})},
  darkAuto:el=>{saveUi({brand:{...brand(),darkAuto:el.checked}})},
  fontUpload:async el=>{const f=el.files&&el.files[0];if(!f)return;const n=cssName(($("#cf-name")||{}).value)||cssName(f.name.replace(/\.[^.]+$/,""));
    if(!/\.(woff2?|ttf|otf)$/i.test(f.name)){toast("الصيغ المدعومة: woff2, woff, ttf, otf","err");return}if(f.size>5*1024*1024){toast("ملف الخط أكبر من 5 ميجابايت","err");return}
    try{let url;if(MODE==="demo"&&!ASSETS){url=URL.createObjectURL(f)}else{toast("جاري رفع الخط…");const r=await ASSETS.upload(f);url=r.url}
      const b=brand();const cf=[...(b.customFonts||[])].filter(x=>cssName(x.name)!==n);cf.push({name:n,url});saveUi({brand:{...b,customFonts:cf,fontBody:n}});toast("رُفع الخط وطُبّق كمعاينة")}catch(e){toast("تعذّر رفع الخط: "+(e&&(e.code||e.message)||""),"err")}el.value=""},
  brandFont:el=>{saveUi({brand:{...brand(),[el.dataset.k]:el.value}})},
  brandColor:el=>{if(HEX.test(el.value))saveUi({brand:{...brand(),[el.dataset.k]:el.value}})},
  myNavShow:el=>{const items=[...modalCtx.items];items[+el.dataset.i]={...items[+el.dataset.i],h:!el.checked};modalCtx.items=items;el.closest(".crow").classList.toggle("off",!el.checked)},
  perm:el=>{const roles=permsDoc();roles[el.dataset.r].perms[el.dataset.k]=el.checked;stageConfig("perms",{roles});},
  pattscope:el=>{const roles=permsDoc();roles[el.dataset.r].attScope=el.value;stageConfig("perms",{roles});},
  pscope:el=>{const roles=permsDoc();roles[el.dataset.r].scope=el.value;stageConfig("perms",{roles});},
  mSurah:el=>{const y=scrollY;ui.mpage=pageOf(Q.ss[+el.value]);render();scrollTo(0,y)},
  mJuz:el=>{const y=scrollY;ui.mpage=pageOf(Q.j[+el.value]);render();scrollTo(0,y)},
  mPage:el=>{ui.mpage=Math.min(604,Math.max(1,n0(el.value)||1));render()},
  tasmee:el=>{ui.tasmee=el.checked;if(!el.checked){ui.marks={};ui.mpick=null}render()},
  mStu:el=>{ui.mstu=el.value;render()},
  schedKind:el=>{ui.skind=el.value;render()},
  rstudent:el=>{if(el.value){ui.rsid=el.value;go("report")}},
  cfg:el=>{const cur=get("config","main")||{};stageConfig("main",{...DEF_CFG,...cur,[el.dataset.k]:el.checked})},
  mrole:el=>{$("#role-student").hidden=el.value!=="student";$("#role-parent").hidden=el.value!=="parent";$("#role-circles").hidden=!STAFF_ROLES.includes(el.value)||el.value==="director";{const t=$("#role-teach");if(t)t.hidden=!["teacher","director","admin","supervisor"].includes(el.value)}{const pa=$("#role-pa");if(pa)pa.hidden=!STAFF_ROLES.includes(el.value)}const o=$("#role-ov");if(o)o.hidden=!STAFF_ROLES.includes(el.value)||el.value==="director"},
  timed:el=>{$("#timed-box").hidden=!el.checked},
  skind:el=>{["single","group","circle"].forEach(k=>{$("#sk-"+k).hidden=el.value!==k})},
  circle:el=>{ui.circle=el.value;render()},
  regRole:el=>{const t=$("#reg-track");if(t)t.hidden=el.value!=="student"},
  aud:el=>{$("#aud-sel").hidden=el.value!=="selected"},
};
const FORMS={
  register:async fd=>{const id="m"+gen();const name=fd.get("name").trim();if(!name)return;
    if(OWNER){await put("members",id,{uid:UID,name,phone:(USERMETA&&USERMETA.phone)||"",email:USEREMAIL,role:"director",status:"active",joined:today()});OWNER=false;await reloadAll();if(fd.get("circleName"))put("config","main",{...DEF_CFG,...(get("config","main")||{}),circleName:fd.get("circleName")})}
    else{await put("members",id,{uid:UID,name,email:USEREMAIL,role:fd.get("role"),track:fd.get("role")==="student"?fd.get("track"):null,phone:fd.get("phone"),note:fd.get("note"),status:"pending",joined:today()});}},
  profile:fd=>{const p={name:String(fd.get("name")||"").trim(),phone:fd.get("phone")||""};if(fd.has("meetLink"))p.meetLink=fd.get("meetLink");if(!p.name){toast("اكتب الاسم","err");throw new Error("اختر")}patch("members",me().id,p);toast("حُفظت بياناتك")},
  circleName:fd=>{const cur=get("config","main")||{};put("config","main",{...DEF_CFG,...cur,circleName:fd.get("circleName"),termName:fd.get("termName"),termStart:fd.get("termStart"),termEnd:fd.get("termEnd")});toast("حُفظ")},
  member:async fd=>{const id=modalCtx.id||"m"+gen();const cur=get("members",id)||{joined:today()};
    const d={...cur,name:fd.get("name"),role:fd.get("role"),status:fd.get("status")||"active",phone:fd.get("phone"),note:fd.get("note")};
    if(d.role==="student"){d.track=fd.get("track");d.teacherId=fd.get("teacherId");d.circleId=fd.get("circleId")||null;d.guardianPhone=fd.get("guardianPhone");d.level=fd.get("level");if(fd.has("divisionId"))d.divisionId=fd.get("divisionId")||""}
    if(d.role==="parent")d.childIds=fd.getAll("childIds");
    if(STAFF_ROLES.includes(d.role))d.circleIds=fd.getAll("circleIds");if(STAFF_ROLES.includes(d.role)&&fd.get("divSync"))d.divisionIds=fd.getAll("divisionIds");
    if(fd.get("paSync")&&realPA()){d.platformAdmin=fd.get("platformAdmin")==="on"&&STAFF_ROLES.includes(d.role);if(!d.platformAdmin&&cur.platformAdmin&&!S.members.some(x=>x.id!==id&&x.platformAdmin===true&&x.status==="active")){toast("لازم يبقى مسؤول منصة واحد على الأقل","err");throw new Error("اختر")}}
    if(["teacher","director","admin","supervisor"].includes(d.role)&&fd.get("teachSync")){const tc=new Set(fd.getAll("teachCircles"));setTimeout(()=>S.circles.forEach(c=>{if(tc.has(c.id)&&c.teacherId!==id)patch("circles",c.id,{teacherId:id});else if(!tc.has(c.id)&&c.teacherId===id)patch("circles",c.id,{teacherId:""})}),300)}
    if(fd.has("scopeOv")){d.scopeOverride=fd.get("scopeOv")||null;d.attScopeOverride=fd.get("attOv")||null;const ov={};ALLP.forEach(k=>{const v=fd.get("ov_"+k);if(v==="1")ov[k]=true;else if(v==="0")ov[k]=false});d.permOverrides=ov}
    if(cur.status==="pending"&&d.status==="pending")d.status="active";
    const link=fd.get("linkTo");
    if(link&&cur.uid){const lk=get("members",link)||{};const uid=cur.uid;del("members",id);setTimeout(()=>patch("members",link,{uid,email:cur.email||lk.email||"",status:"active",phone:d.phone||lk.phone}),400);toast("رُبط الحساب بالسجل السابق");return}
    await put("members",id,d);toast("حُفظ");
    if(fd.get("mkAcct")&&!cur.uid){await createAccount(id,fd.get("username"),fd.get("password"))}},
  div:fd=>{const L=[...divs()];const id=modalCtx.id||"dv"+gen();const d={id,name:(fd.get("name")||"").trim(),color:fd.get("color")||"#284a70",desc:(fd.get("desc")||"").trim()};if(!d.name){toast("اكتب الاسم","err");throw new Error("اختر")}
    const i=L.findIndex(x=>x.id===id);if(i>=0)L[i]=d;else L.push(d);const cur=get("config","main")||{};put("config","main",{...DEF_CFG,...cur,divisions:L});toast("حُفظ")},
  divDel:()=>{const id=modalCtx.id;const cur=get("config","main")||{};put("config","main",{...DEF_CFG,...cur,divisions:divs().filter(d=>d.id!==id)});
    S.circles.filter(c=>c.divisionId===id).forEach(c=>patch("circles",c.id,{divisionId:""}));S.members.filter(x=>x.divisionId===id).forEach(x=>patch("members",x.id,{divisionId:""}));
    S.members.filter(x=>(x.divisionIds||[]).includes(id)).forEach(x=>patch("members",x.id,{divisionIds:x.divisionIds.filter(y=>y!==id)}));S.programs.filter(p=>(p.divisionIds||[]).includes(id)).forEach(p=>patch("programs",p.id,{divisionIds:p.divisionIds.filter(y=>y!==id)}));
    if(ui.div===id)ui.div="all";toast("حُذف")},
  idReset:()=>{saveUi({brand:{...DEF_BRAND,primary:"",accent:"",light:{},dark:{}}});toast("أُعيدت الهوية الافتراضية كمعاينة")},
  jdelAll:()=>{patch("members",modalCtx.sid,{hifzMap:{}});ui.jdel=null;toast("حُذفت كل علامات الخريطة")},
  bulkPlan:fd=>{const t=tplList().find(x=>x.id===fd.get("tpl"));if(!t){toast("اختر القالب","err");throw new Error("اختر")}const ids=fd.getAll("sids");if(!ids.length){toast("اختر الطلاب","err");throw new Error("اختر")}
    const sd=fd.get("startDate")||today(),ed=fd.get("endDate")||"";const tl=mqAL()?rangeLines(t.gFromS,t.gFromA,t.gToS,t.gToA):0;
    ids.forEach(id=>{const s=get("members",id);if(!s)return;const op=s.plan||{};const p={dir:t.dir,gFromS:t.gFromS,gFromA:t.gFromA,gToS:t.gToS,gToA:t.gToA,amt:t.amt,amtN:t.amtN,amtU:t.amtU,unit:"line",days:t.days,startDate:sd,endDate:ed,goal:t.goal||op.goal||"",direction:t.dir==="up"?"من الناس صعوداً":"من البقرة نزولاً",basePages:n0(op.basePages),tpl:t.id};
      if(tl)p.targetPages=p.basePages+Math.round(tl/15);if(t.rev&&s.track!=="tilawa")p.rev={...t.rev,on:true,nextS:0,nextA:0,cycle:0};put("members",id,{...s,plan:p})});
    toast(`طُبّقت خطة «${t.name}» على ${ids.length} ${ids.length<=10?"طلاب":"طالباً"}`)},
  resched:fd=>{const s=get("members",modalCtx.sid);const p={...s.plan};const d=fd.get("d")||today();const pos=modalCtx.pos;const mode=fd.get("mode");
    const amt=mode==="fit"&&modalCtx.fit?modalCtx.fit:n0(p.amt);p.schFrom={d,s:pos[0],a:pos[1],amt:amt!==n0(p.amt)?amt:0,at:today()};patch("members",s.id,{plan:p});
    if(fd.get("clear")){S.tasks.filter(t=>t.studentId===s.id&&t.date>=d&&!t.done&&(t.kind==="hifz"||t.kind==="tilawa")).forEach(t=>del("tasks",t.id));setTimeout(()=>genFromSchedule(get("members",s.id),7),300)}
    toast("أُعيدت جدولة الخطة")},
  noop:()=>{},
  tenant:async fd=>{const id=modalCtx.id||"tn"+gen();const cur=(TN.list.find(t=>t.id===id)||{data:{key:(crypto.randomUUID?crypto.randomUUID():gen()+gen()+gen()).replace(/-/g,""),status:"active",created:today()}}).data;
    const slug=String(fd.get("slug")||"").trim().toLowerCase();const sbKey=String(fd.get("sbKey")||"").trim();if(/service_role|sb_secret_/i.test(sbKey)){toast("هذا مفتاح سري! ضع المفتاح العام (anon / publishable) فقط","err");throw new Error("اختر")}if(slug&&!/^[a-z0-9-]{2,30}$/.test(slug)){toast("المعرّف: حروف إنجليزية صغيرة وأرقام فقط","err");throw new Error("اختر")}if(slug&&(TN.list||[]).some(t=>t.id!==id&&t.data.slug===slug)){toast("المعرّف مستخدم لبرنامج آخر","err");throw new Error("اختر")}
    const d={...cur,slug,sbUrl:String(fd.get("sbUrl")||"").trim().replace(/\/$/,""),sbKey,color:fd.get("color")||"",name:(fd.get("name")||"").trim(),url:(fd.get("url")||"").trim()||(slug?PROG_BASE()+slug+"/":""),contact:(fd.get("contact")||"").trim(),plan:(fd.get("plan")||"").trim(),expires:fd.get("expires")||"",message:(fd.get("message")||"").trim(),notes:(fd.get("notes")||"").trim()};
    if(!d.name){toast("اكتب اسم البرنامج","err");throw new Error("اختر")}const{error}=await SB.from("tenants").upsert({id,data:d});if(error){toast(errMsg(error,"تعذّر الحفظ"),"err");throw new Error("اختر")}toast("حُفظ البرنامج");tnLoad()},
  tnStatus:async()=>{const t=TN.list.find(x=>x.id===modalCtx.id);if(!t)return;const{error}=await SB.from("tenants").update({data:{...t.data,status:modalCtx.st}}).eq("id",t.id);if(error)toast(errMsg(error,"تعذّر الحفظ"),"err");else toast(modalCtx.st==="suspended"?"أُوقف الاشتراك":"فُعّل الاشتراك");tnLoad()},
  clrMarks:()=>{ui.marks={};ui.mpick=null;ui.mlast=null;toast("حُذفت كل العلامات");render()},
  plan:fd=>{const s=get("members",modalCtx.sid);const f=document.querySelector('form[data-form="plan"]');const np=planFromForm(f);const op=s.plan||{};
    if(!np.gFromS||!np.gToS){toast("حدد سورة البداية والنهاية","err");throw new Error("اختر")}
    if(!(np.amt>0)){toast("حدد مقدار الورد اليومي","err");throw new Error("اختر")}
    if(!np.days.length){toast("اختر أيام الخطة","err");throw new Error("اختر")}
    if(np.endDate&&np.startDate&&np.endDate<np.startDate){toast("تاريخ النهاية قبل البداية","err");throw new Error("اختر")}
    const bad=np.dir==="up"?np.gFromS<np.gToS:np.gFromS>np.gToS;if(bad){toast(np.dir==="up"?"في الاتجاه الصاعد تكون سورة البداية بعد سورة النهاية (مثل: من الناس إلى الملك)":"في الاتجاه النازل تكون سورة البداية قبل سورة النهاية","err");throw new Error("اختر")}
    if(!np.gToA)np.gToA=SURAHS[np.gToS-1].a;np.gFromA=Math.min(np.gFromA,SURAHS[np.gFromS-1].a);np.gToA=Math.min(np.gToA,SURAHS[np.gToS-1].a);
    const p={...np,goal:(fd.get("goal")||"").trim(),direction:np.dir==="up"?"من الناس صعوداً":"من البقرة نزولاً"};delete p.rev;
    if(s.track!=="tilawa"&&np.rev&&np.rev.on){const v=np.rev;if(!v.fS||!v.tS||!(v.amt>0)){toast("أكمل بيانات خطة المراجعة: النطاق والمقدار","err");throw new Error("اختر")}
      if(v.dir==="up"?v.fS<v.tS:v.fS>v.tS){toast("خطة المراجعة: ترتيب سورة البداية والنهاية لا يوافق الاتجاه","err");throw new Error("اختر")}
      if(!v.days.length)v.days=np.days;if(!v.tA)v.tA=SURAHS[v.tS-1].a;const o=op.rev||{};if(o.on&&o.nextS&&!fd.get("revReset")&&o.fS===v.fS&&o.fA===v.fA&&o.tS===v.tS&&o.tA===v.tA){v.nextS=o.nextS;v.nextA=o.nextA;v.cycle=o.cycle||0}p.rev=v}
    else if(s.track!=="tilawa"&&op.rev&&!np.rev.on)p.rev={...op.rev,on:false};
    if(op.dailyRev&&!(p.rev&&p.rev.on))p.dailyRev=op.dailyRev;
    const tl=rangeLines(p.gFromS,p.gFromA,p.gToS,p.gToA);p.basePages=n0(op.basePages);if(tl)p.targetPages=p.basePages+Math.round(tl/15);
    const same=n0(op.gFromS)===p.gFromS&&n0(op.gFromA)===p.gFromA;if(op.nextS&&!fd.get("resetPtr")&&same){p.nextS=op.nextS;p.nextA=op.nextA}
    patch("members",s.id,{plan:p});toast("حُفظت الخطة")},
  task:async fd=>{const d={date:fd.get("date"),kind:fd.get("kind"),title:String(fd.get("title")||"").trim(),details:fd.get("details"),link:fd.get("link"),surah:n0(fd.get("surah"))||null,fromA:n0(fd.get("fromA"))||null,toA:n0(fd.get("toA"))||null};if(!d.title&&d.surah)d.title=`${KIND[d.kind]||""} سورة ${SN(d.surah)}`.trim();if(!d.title){toast("اكتب عنوان المهمة أو اختر السورة","err");throw new Error("اختر")}
    const file=fd.get("file");if(file&&file.size&&ASSETS){try{toast("جاري رفع الملف…");const r=await ASSETS.upload(file);d.fileUrl=r.url;d.fileId=r.id;d.fileName=file.name}catch(e){toast("تعذّر رفع الملف: "+(e&&e.code||""),"err")}}
    if(modalCtx.id){patch("tasks",modalCtx.id,d);return}
    const ids=fd.get("all")?(modalCtx.sid?myStudents(me()):scoped(me())).map(s=>s.id):modalCtx.sid?[modalCtx.sid]:fd.getAll("sids");
    if(!ids.length){toast("اختر طالباً واحداً على الأقل","err");throw new Error("اختر الطلاب")}
    ids.forEach(sid=>put("tasks","t"+gen(),{...d,studentId:sid,done:false,createdBy:me().id}));toast(ids.length>1?`أُسندت لـ ${ids.length} طالب`:"أُضيفت المهمة")},
  log:fd=>{const sid=modalCtx.sid,date=fd.get("date"),id=`${sid}_${date}`;const d={studentId:sid,date,teacherId:me().id,attendance:fd.get("attendance"),noteStudent:fd.get("noteStudent"),noteParent:fd.get("noteParent"),noteStaff:fd.has("noteStaff")?fd.get("noteStaff"):((get("logs",`${sid}_${date}`)||{}).noteStaff||""),tajweed:fd.getAll("tajweed")};
    ["newSurah","newFrom","newTo","newPages","newGrade","revDesc","revPages","revGrade","tSurah","tFrom","tTo","tPages","errs","tanbih","talqin","tGrade","tajweedNote"].forEach(k=>{if(fd.has(k))d[k]=fd.get(k)});
    const old=get("logs",id);if(old&&old.marks)d.marks=old.marks;put("logs",id,d);toast("حُفظت المتابعة")},
  session:fd=>{const m=me();const staff=isStaff(m);const sk=staff?fd.get("skind"):"single";
    const cur=modalCtx.id?{...get("sessions",modalCtx.id)}:{};delete cur.studentId;delete cur.studentIds;delete cur.circleId;
    let tgt={},s=null,t=null;
    if(sk==="circle"){const c=get("circles",fd.get("circleId"));if(!c){toast("اختر الحلقة","err");throw new Error("اختر الحلقة")}tgt={circleId:c.id,studentIds:[]};t=get("members",c.teacherId)}
    else if(sk==="group"){const ids=fd.getAll("studentIds");if(ids.length<1){toast("اختر طالباً واحداً على الأقل","err");throw new Error("اختر الطلاب")}tgt={studentIds:ids,studentId:ids[0]};s=get("members",ids[0])}
    else{const sid=staff?fd.get("studentId"):(m.role==="parent"?modalCtx.sid:m.id);s=get("members",sid);if(!s){toast("اختر الطالب","err");throw new Error("اختر الطالب")}tgt={studentId:sid,studentIds:[sid]}}
    if(s&&!t)t=teacherOf(s);
    const d={...cur,...tgt,teacherId:cur.teacherId||(sk==="circle"&&t?t.id:null)||(s&&s.teacherId)||m.id,start:new Date(fd.get("start")).toISOString(),duration:n0(fd.get("duration"))||30,note:fd.get("note")};
    if(staff){d.link=fd.get("link");d.status=fd.get("status")}else{d.status="requested";d.link=d.link||(t&&t.meetLink)||"";d.requestedBy=m.role}
    put("sessions",modalCtx.id||"s"+gen(),d);toast(staff?"حُفظ الموعد":"أُرسل طلب الموعد لمعلمك")},
  program:fd=>{const id=modalCtx.id||"p"+gen();const cur=get("programs",id)||{lessons:[],createdBy:me().id};put("programs",id,{...cur,title:fd.get("title"),kind:fd.get("kind"),audience:fd.get("audience"),description:fd.get("description"),studentIds:fd.getAll("studentIds"),hidden:!!fd.get("hidden"),...(divs().length?{divisionIds:fd.getAll("divisionIds")}:{})});if(!modalCtx.id){ui.pid=id;go("program")}},
  lesson:async fd=>{const p=get("programs",modalCtx.pid);const L=[...(p.lessons||[])];const i=L.findIndex(l=>l.id===modalCtx.id);
    const l={...(i>=0?L[i]:{id:"l"+gen()}),title:fd.get("title"),date:fd.get("date"),body:fd.get("body"),link:fd.get("link"),kind:fd.get("kind")||"lesson",at:fd.get("at")?new Date(fd.get("at")).toISOString():"",meetLink:fd.get("meetLink")||""};
    const file=fd.get("file");
    if(file&&file.size&&ASSETS){try{toast("جاري رفع الملف…");const r=await ASSETS.upload(file);l.fileUrl=r.url;l.fileId=r.id;l.fileName=file.name}catch(e){toast("تعذّر رفع الملف: "+(e&&e.code||""),"err")}}
    if(i>=0)L[i]=l;else L.push(l);patch("programs",p.id,{lessons:L});
    if(fd.get("asTask")){const n=lessonToTasks(p,l,fd.get("taskDate")||today());toast(`أُضيف الدرس وأُرسل مهمةً لـ ${n} طالب`)}},
  noop:()=>{},
  dzImport:fd=>{let d;try{d=JSON.parse(String(fd.get("json")||""))}catch(e){throw new Error("النص غير صالح")}const x=d&&d.design?d.design:d;if(!x||typeof x!=="object")throw new Error("النص غير صالح");setDesign(x,true);toast("طُبّق التصميم كمعاينة. اضغط «حفظ التعديلات» ليظهر للجميع")},
  hbCustom:async fd=>{const g=modalCtx.g;const id=modalCtx.id||("c"+Date.now().toString(36));const list=[...homeCustom(g)];const cur=list.find(c=>c.id===id)||{id};
    const f=fd.get("img");let img=cur.img||"";if(fd.get("rmimg"))img="";
    if(f&&f.size){if(!/^image\//.test(f.type))throw new Error("اختر صورة");if(ASSETS){toast("جاري رفع الصورة…");img=(await ASSETS.upload(f)).url}else if(MODE==="demo"){img=URL.createObjectURL(f)}else{img=await fitImg(f,1400)}}
    const link=String(fd.get("link")||"").trim();
    const c={...cur,t:String(fd.get("t")||"").trim(),x:String(fd.get("x")||"").trim(),link:/^https:\/\//.test(link)?link:"",lt:String(fd.get("lt")||"").trim(),img,imgMode:fd.get("imgMode")==="bg"?"bg":"top",bg:fd.get("nobg")?"":String(fd.get("bg")||""),fg:fd.get("nofg")?"":String(fd.get("fg")||"")};
    const i=list.findIndex(x=>x.id===id);if(i>=0)list[i]=c;else list.push(c);const HC={...(uiCfg().homeCustom||{})};HC[g]=list;
    const home={...(uiCfg().home||{})};let arr=[...(home[g]||homeOrder(g).map(x=>({k:x.k,...(x.h?{h:true}:{}),...(x.w?{w:x.w}:{}),...(x.hh?{hh:x.hh}:{}),...(x.sz?{sz:x.sz}:{}),...(x.st?{st:true}:{})})))];if(!arr.some(x=>x.k==="cx:"+id))arr.push({k:"cx:"+id,w:6});home[g]=arr;const extra={};["homeM","homeD"].forEach(K=>{const o=uiCfg()[K];if(o&&o[g]&&!o[g].some(x=>x.k==="cx:"+id)){extra[K]={...o,[g]:[...o[g],{k:"cx:"+id,w:K==="homeM"?12:6}]}}});
    saveUi({homeCustom:HC,home,...extra});toast("أُضيف المربع. اضغط «حفظ التعديلات» ليظهر للجميع")},
  myNav:()=>{const items=modalCtx.items;patch("members",me().id,{navPref:items.map(x=>({k:x.k,...(x.h?{h:true}:{})}))});toast("حُفظ ترتيب قائمتك")},
  exam:fd=>{const m=me();const id=modalCtx.id||"e"+gen();const cur=get("exams",id)||{studentId:modalCtx.sid,examiner:m.id};
    const d={...cur,date:fd.get("date"),scope:fd.get("scope"),juzFrom:n0(fd.get("juzFrom"))||null,juzTo:n0(fd.get("juzTo"))||null,score:n0(fd.get("score")),tanbih:n0(fd.get("tanbih")),talqin:n0(fd.get("talqin")),notes:fd.get("notes")};
    put("exams",id,d);if(!modalCtx.id&&d.score>=85){CERT_PRE=`شهادة اجتياز اختبار ${d.scope}`;setTimeout(()=>{toast("اجتاز الطالب الاختبار، وهذه شهادته جاهزة للإصدار");certForm(d.studentId)},300)}
    if(fd.get("markJuz")&&d.score>=70&&d.juzFrom){const s=get("members",d.studentId);const mp={...(s.hifzMap||{})};const a=Math.min(d.juzFrom,d.juzTo||d.juzFrom),b=Math.max(d.juzFrom,d.juzTo||d.juzFrom);for(let j=a;j<=b;j++)mp[j]="x";patch("members",s.id,{hifzMap:mp})}
    toast("حُفظ الاختبار")},
  cert:fd=>{put("certs","z"+gen(),{studentId:modalCtx.sid,title:fd.get("title"),body:fd.get("body"),date:fd.get("date")||today(),signer:fd.get("signer"),issuedBy:me().id});toast("أُصدرت الشهادة، ويراها الطالب وولي الأمر")},
  recit:async fd=>{const m=me();let file=fd.get("file");if((!file||!file.size)&&REC.blob){const ext=/mp4/.test(REC.blob.type)?"m4a":/ogg/.test(REC.blob.type)?"ogg":"webm";file=new File([REC.blob],`tasmee-${today()}.${ext}`,{type:REC.blob.type})}const d={studentId:m.id,teacherId:m.teacherId||"",date:today(),createdAt:new Date().toISOString(),title:fd.get("title"),note:fd.get("note"),status:"pending"};
    if(file&&file.size){if(!ASSETS){toast("رفع الملفات غير متاح لحسابك","err");throw new Error("no assets")}toast("جاري رفع التسجيل…");try{const r=await ASSETS.upload(file);d.fileUrl=r.url;d.fileId=r.id;d.fileName=file.name}catch(e){toast("تعذّر رفع الملف: "+(e&&e.code||""),"err");throw e}}
    else if(MODE!=="demo"){toast("سجّل تسميعك أو اختر ملف الصوت","err");throw new Error("no file")}
    put("recits","r"+gen(),d);if(REC.url)A.recDiscard();toast("أُرسل التسميع لمعلمك")},
  recitReview:fd=>{patch("recits",modalCtx.id,{status:"reviewed",grade:n0(fd.get("grade"))||null,errs:n0(fd.get("errs")),tanbih:n0(fd.get("tanbih")),talqin:n0(fd.get("talqin")),feedback:fd.get("feedback"),reviewedBy:me().id,reviewedAt:new Date().toISOString()});toast("حُفظ التقييم")},
  msgs:fd=>{patch("members",modalCtx.sid,{msgStudent:fd.get("msgStudent").trim(),msgParent:fd.get("msgParent").trim()});toast("حُفظت الملاحظات")},
  circle:fd=>{const m=me();const id=modalCtx.id||"c"+gen();const cur=get("circles",id)||{createdBy:m.id};
    const d={...cur,name:fd.get("name"),teacherId:fd.get("teacherId")||m.id,track:fd.get("track"),...(fd.get("timed")?{days:fd.getAll("days").map(Number),time:fd.get("time")||"",duration:n0(fd.get("duration"))||60}:{days:[],time:"",duration:null}),meetLink:fd.get("meetLink"),description:fd.get("description"),...(fd.has("divisionId")?{divisionId:fd.get("divisionId")||""}:{})};
    put("circles",id,d);const sel=new Set(fd.getAll("students"));
    allStudents().forEach(s=>{if(sel.has(s.id)&&s.circleId!==id)patch("members",s.id,{circleId:id});else if(!sel.has(s.id)&&s.circleId===id)patch("members",s.id,{circleId:null})});
    toast("حُفظت الحلقة");if(!modalCtx.id){ui.cid=id;go("circle")}},
  lessonTask:fd=>{const p=get("programs",modalCtx.pid);const l=(p.lessons||[]).find(x=>x.id===modalCtx.lid);const n=lessonToTasks(p,l,fd.get("taskDate"));toast(`أُرسل لـ ${n} طالب`)},
};
const ACT_PERM={addStudent:"students.edit",editMsgs:"students.edit",addMember:"members.manage",delMember:"members.manage",approve:"members.approve",newCircle:"circles.manage",editCircle:"circles.manage",delCircle:"circles.manage",
 editPlan:"plans.edit",juz:"plans.edit",jdelMode:"plans.edit",jdelAll:"plans.edit",divNew:"settings.manage",divEdit:"settings.manage",divDel:"settings.manage",logoDel:"ui.customize",idExport:"ui.customize",idReset:"ui.customize",genWeek:"tasks.edit",newTask:"tasks.edit",editTask:"tasks.edit",delTask:"tasks.edit",newTaskAt:"tasks.edit",
 att:"daily.log",attAll:"daily.log",logFor:"daily.log",editLog:"daily.log",delLog:"logs.delete",saveTasmee:"daily.log",circleDaily:"daily.log",circleDay:"daily.log",mushafFor:"daily.log",
 editSession:"sessions.manage",delSession:"sessions.manage",newProgram:"programs.manage",editProgram:"programs.manage",delProgram:"programs.manage",hideProgram:"programs.manage",newLesson:"programs.manage",editLesson:"programs.manage",delLesson:"programs.manage",lessonTask:"programs.manage",
 newExam:"exams.manage",editExam:"exams.manage",delExam:"exams.manage",newCert:"certs.issue",delCert:"certs.issue",reviewRecit:"recits.review",delRecit:"recits.review",tatt:"tatt.manage",
 csv:"reports.export",copyAll:"reports.export",copyParent:"reports.export",copyProgram:"reports.export",backup:"perms.manage",navMove:"ui.customize",dzComp:"ui.customize",dzcSet:"ui.customize",dzcClr:"ui.customize",dzcReset:"ui.customize",dzSaveTpl:"ui.customize",dzMyApply:"ui.customize",dzMyDel:"ui.customize",dzExport:"ui.customize",dzImport:"ui.customize",homeW:"ui.customize",dzSet:"ui.customize",dzTpl:"ui.customize",dzReset:"ui.customize",navReset:"ui.customize",homeMove:"ui.customize",homeReset:"ui.customize",termsReset:"ui.customize",replAdd:"ui.customize",replDel:"ui.customize",colorsReset:"ui.customize",brandClear:"ui.customize",cmodeTab:"ui.customize",tokClear:"ui.customize",fontGoogle:"ui.customize",fontDel:"ui.customize",fontsReset:"ui.customize",fontScale:"ui.customize",pickFont:"ui.customize",xlsAll:"reports.export",pdfAll:"reports.export",xlsOne:"reports.export",pdfOne:"reports.export",xlsProg:"reports.export",pdfProg:"reports.export",openReport:"reports.view",openStudent:"view.students"};
const ACT_PERM_STAFF={newSession:"sessions.manage",toggleTask:"daily.log"};
function actPerm(a){const m=me();if(!m||!isStaff(m))return null;return ACT_PERM[a]||ACT_PERM_STAFF[a]||null}
const PARENT_DENY=a=>/^(new|edit|del|add|create|save|kh(Start|Reset|Approve|Tick|Pick)|selfWird|selfConfirm|selfReject|recit|upload|toggleTask|tatt|reviewRecit|cancelSess|sess(Done|Cancel|Edit))/.test(a||"");
function applyPerms(root){const m=me();if(m&&m.role==="parent"){root.querySelectorAll("[data-act]").forEach(el=>{if(PARENT_DENY(el.dataset.act)){if(el.tagName==="TR"||el.classList.contains("clickable")){el.removeAttribute("data-act");el.classList.remove("clickable")}else el.hidden=true}});return}if(!m||!isStaff(m))return;root.querySelectorAll("[data-act]").forEach(el=>{const p=actPerm(el.dataset.act);if(p&&!can(m,p)){if(el.classList.contains("tk")||el.classList.contains("cb")||el.classList.contains("clickable")||el.tagName==="TR"){el.removeAttribute("data-act");el.classList.remove("clickable");if(el.tagName==="BUTTON")el.disabled=true}else el.hidden=true}})}
document.addEventListener("click",e=>{const el=e.target.closest("[data-act]");if(!el)return;if(el.dataset.act==="backdrop"&&e.target!==el)return;{const a=e.target.closest("a,input,select,textarea");if(a&&a!==el&&el.contains(a))return}const f=A[el.dataset.act];if(!f)return;{const mm=me();if(mm&&mm.role==="parent"&&PARENT_DENY(el.dataset.act)){e.preventDefault();toast("حساب ولي الأمر للاطلاع فقط","err");return}}{const p=actPerm(el.dataset.act);if(p&&!can(me(),p)){e.preventDefault();toast("ليست لديك صلاحية لهذا الإجراء","err");return}}if(el.tagName==="A")return;e.preventDefault();f(el,e)});
document.addEventListener("change",e=>{const el=e.target.closest("[data-change]");if(el&&CH[el.dataset.change])CH[el.dataset.change](el)});
let qT;document.addEventListener("input",e=>{const el=e.target;if(el.dataset.input==="wa"){const a=$("#wa-link");if(a&&modalCtx&&modalCtx.num)a.href=`https://wa.me/${modalCtx.num}?text=${encodeURIComponent(el.value)}`;return}if(el.dataset.input==="q"){ui.q=el.value.trim();clearTimeout(qT);qT=setTimeout(render,200)}});
document.addEventListener("submit",async e=>{const f=e.target.closest("form[data-form]");if(!f)return;e.preventDefault();const fn=FORMS[f.dataset.form];if(!fn)return;const inModal=$("#modal").contains(f);try{await fn(new FormData(f))}catch(err){console.error(err);if(!/no file|no assets|اختر/.test(err.message||""))toast("حدث خطأ: "+err.message,"err");return}if(inModal)closeModal();else if(f.dataset.form==="recit")f.reset()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modalCtx)closeModal();
  if((e.key==="Enter"||e.key===" ")&&e.target.classList&&(e.target.classList.contains("tap-task")||e.target.classList.contains("w"))){e.preventDefault();e.target.click();return}
  if(ui.view==="mushaf"&&!RD.on&&!modalCtx&&Q&&!/INPUT|SELECT|TEXTAREA/.test((e.target.tagName||""))){if(e.key==="ArrowLeft"){ui.mpage=Math.min(604,ui.mpage+1);render()}else if(e.key==="ArrowRight"){ui.mpage=Math.max(1,ui.mpage-1);render()}}});
window.addEventListener("hashchange",()=>{const v=location.hash.slice(1);if(v&&v!==ui.view){ui.view=v;render()}});

/* ============ العرض التجريبي ============ */
function startDemo(){
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;const pick=a=>a[Math.floor(rnd()*a.length)];
  COLS.forEach(c=>DEMO[c]=[]);PREV=MODE;S=DEMO;MODE="demo";
  const P=(id,d)=>DEMO.members.push({id,status:"active",joined:addDays(today(),-60),...d});
  P("d-admin",{name:"أ. خالد العتيبي",role:"director",meetLink:"https://meet.google.com/abc-defg-hij",phone:"0500000001"});
  P("d-t1",{name:"أ. فهد القحطاني",role:"teacher",meetLink:"https://meet.google.com/xyz-uvwx-rst",phone:"0500000002"});
  P("d-sup",{name:"أ. سعد المطيري",role:"supervisor",circleIds:["c1","c2"],phone:"0500000003"});
  P("d-asst",{name:"عبدالله الزهراني",role:"assistant",circleIds:["c3"],attScopeOverride:"circle"});
  P("d-exam",{name:"الشيخ محمد الشمراني",role:"examiner",permOverrides:{"daily.log":true}});
  const ST=[["d-s1","عبدالرحمن السالم","hifz","d-admin",{gFromS:67,gFromA:1,gToS:77,gToA:50,amt:0.5,unit:"page",goal:"حفظ جزء تبارك خلال الفصل",dailyNew:"نصف وجه",dailyRev:"جزء عم كاملاً",direction:"من الناس صعوداً",startPoint:"سورة الملك",basePages:23,targetPages:43,days:[0,1,2,3,4]}],
    ["d-s2","يوسف الحربي","hifz","d-admin",{goal:"إتمام جزء قد سمع",dailyNew:"وجه",dailyRev:"نصف جزء",direction:"من الناس صعوداً",startPoint:"سورة المجادلة",basePages:60,targetPages:80,days:[0,1,2,3]}],
    ["d-s3","إبراهيم الغامدي","hifz","d-t1",{goal:"حفظ جزء عم",dailyNew:"5 آيات",dailyRev:"3 أوجه",direction:"من الناس صعوداً",startPoint:"سورة الناس",basePages:4,targetPages:23,days:[0,1,2,3,4]}],
    ["d-s4","عمر الشهري","tilawa","d-admin",{goal:"ختمة مجوّدة خلال الفصل",dailyTilawa:"وجهان",focus:"المدود والغنة",basePages:120,targetPages:604,days:[0,1,2,3,4]}],
    ["d-s5","سلمان الدوسري","tilawa","d-t1",{goal:"تصحيح التلاوة في قصار السور",dailyTilawa:"وجه",focus:"مخارج الحروف",basePages:10,targetPages:100,days:[0,2,4]}]];
  ST.forEach(([id,name,track,teacherId,plan])=>P(id,{name,role:"student",track,teacherId,plan:{...plan,startDate:addDays(today(),-45),endDate:addDays(today(),75)},guardianPhone:"05xxxxxxxx",level:"المرحلة المتوسطة"}));
  DEMO.circles.push({id:"c1",name:"حلقة الفرقان",teacherId:"d-admin",track:"hifz",days:[0,1,2,3,4],time:"20:00",duration:60,meetLink:"https://meet.google.com/abc-defg-hij",description:"حلقة الحفظ المسائية للمرحلة المتوسطة"},
    {id:"c2",name:"حلقة التلاوة المجوّدة",teacherId:"d-admin",track:"tilawa",days:[0,2,4],time:"17:30",duration:45,meetLink:"https://meet.google.com/tlw-abcd-efg"},
    {id:"c3",name:"حلقة البراعم",teacherId:"d-t1",track:"mixed",days:[],time:"",meetLink:"https://meet.google.com/xyz-uvwx-rst"});
  const CM={"d-s1":"c1","d-s2":"c1","d-s4":"c2","d-s3":"c3","d-s5":"c3"};DEMO.members.forEach(x=>{if(CM[x.id])x.circleId=CM[x.id]});
  P("d-p1",{name:"أبو عبدالرحمن السالم",role:"parent",childIds:["d-s1"]});
  const hifzS=["الملك","القلم","الحاقة","المعارج","نوح"];
  ST.forEach(([sid,,track,tid,plan])=>{
    for(let i=40;i>=0;i--){const d=addDays(today(),-i);if(!plan.days.includes(dow(d)))continue;
      if(i===0){continue}
      const r=rnd();const att=r<.78?"present":r<.86?"late":r<.94?"absent":"excused";const l={id:`${sid}_${d}`,studentId:sid,date:d,teacherId:tid,attendance:att,tajweed:[]};
      if(att==="present"||att==="late"){if(track==="hifz"){const s=pick(hifzS);const f=1+Math.floor(rnd()*20);Object.assign(l,{newSurah:s,newFrom:f,newTo:f+4,newPages:pick([0.5,0.5,1,0.25]),newGrade:pick([5,5,4,4,3]),revDesc:pick(["جزء عم","النبأ–عبس","التكوير–الطارق"]),revPages:pick([3,5,10]),revGrade:pick([5,4,4,3])});if(rnd()<.3)l.tajweed=[pick(TAJWEED)]}
        else{const si=60+Math.floor(rnd()*50);const s=SURAHS[si];Object.assign(l,{tSurah:s.n,tFrom:1,tTo:Math.min(s.a,10+Math.floor(rnd()*20)),tPages:pick([1,2,2,3]),errJali:Math.floor(rnd()*3),errKhafi:Math.floor(rnd()*6),tGrade:pick([5,4,4,3,3]),tajweed:rnd()<.6?[pick(TAJWEED),pick(TAJWEED)].filter((v,i,a)=>a.indexOf(v)===i):[]})}
        if(rnd()<.3){l.noteStudent=pick(["أحسنت، استمر.","ثبّت المقطع قبل الانتقال.","تحسن واضح هذا الأسبوع.","انتبه لمواضع الوقف."]);l.noteParent=pick(["نرجو متابعة المراجعة في البيت.","الطالب متميز هذا الأسبوع.","يحتاج تشجيعاً على الحضور مبكراً."])}}
      DEMO.logs.push(l)}
    for(let i=-7;i<=14;i++){const d=addDays(today(),i);if(!plan.days.includes(dow(d))&&i!==0)continue;const past=i<0;
      if(track==="tilawa")DEMO.tasks.push({id:`t-${sid}-${i}a`,studentId:sid,date:d,kind:"tilawa",title:"تلاوة "+plan.dailyTilawa,details:"مع تطبيق أحكام "+plan.focus,done:past&&rnd()<.85,doneAt:past?new Date().toISOString():null});
      else{const rg=sid==="d-s1"?(()=>{const a0=(i+7)*4;return a0<30?{surah:67,fromA:a0+1,toA:Math.min(30,a0+4)}:{surah:68,fromA:a0-29,toA:Math.min(52,a0-26)}})():null;DEMO.tasks.push({id:`t-${sid}-${i}a`,studentId:sid,date:d,kind:"hifz",title:rg?"حفظ سورة "+SN(rg.surah):"حفظ "+plan.dailyNew,...(rg||{}),details:"",done:past&&rnd()<.85||(i===0&&sid==="d-s1"),doneAt:new Date().toISOString()});DEMO.tasks.push({id:`t-${sid}-${i}b`,studentId:sid,date:d,kind:"murajaa",title:"مراجعة "+plan.dailyRev,details:"",done:past&&rnd()<.8,doneAt:new Date().toISOString()})}}
  });
  DEMO.tasks.push({id:"t-tf1",studentId:"d-s1",date:today(),kind:"tafsir",title:"تفسير جزء تبارك: سورة القلم (1–33)",details:"اقرأ تفسير الصفحة، ودوّن ثلاث فوائد من قصة أصحاب الجنة.",link:"https://quran.ksu.edu.sa/tafseer/",programId:"pr1",lessonId:"l3",done:false});
  const at=(dd,h,mi)=>{const d=new Date();d.setDate(d.getDate()+dd);d.setHours(h,mi,0,0);return d.toISOString()};
  DEMO.sessions.push({id:"ss1",studentId:"d-s1",teacherId:"d-admin",start:at(0,20,0),duration:30,link:"https://meet.google.com/abc-defg-hij",status:"confirmed",note:"تسميع سورة الملك كاملة"});
  DEMO.sessions.push({id:"ss2",studentId:"d-s4",teacherId:"d-admin",start:at(1,17,30),duration:20,link:"https://meet.google.com/abc-defg-hij",status:"confirmed",note:"اختبار المدود"});
  DEMO.sessions.push({id:"ss3",studentId:"d-s2",teacherId:"d-admin",start:at(2,19,0),duration:30,link:"",status:"requested",note:"أرغب في تسميع المجادلة"});
  DEMO.sessions.push({id:"ss4",studentId:"d-s1",teacherId:"d-admin",start:at(-6,20,0),duration:30,link:"https://meet.google.com/abc-defg-hij",status:"done"});
  DEMO.sessions.push({id:"ss6",circleId:"c1",studentIds:[],teacherId:"d-admin",start:at(1,20,0),duration:60,link:"https://meet.google.com/abc-defg-hij",status:"confirmed",note:"اختبار شهري لجزء تبارك"});
  DEMO.sessions.push({id:"ss7",studentIds:["d-s4","d-s5"],studentId:"d-s4",teacherId:"d-admin",start:at(3,18,0),duration:40,link:"https://meet.google.com/grp-tjwd-xyz",status:"confirmed",note:"درس تطبيقي في المدود"});
  DEMO.sessions.push({id:"ss5",studentId:"d-s3",teacherId:"d-t1",start:at(0,18,0),duration:15,link:"https://meet.google.com/xyz-uvwx-rst",status:"confirmed"});
  DEMO.programs.push({id:"pr1",title:"تفسير جزء تبارك",kind:"tafsir",audience:"hifz",description:"درس أسبوعي مختصر في تفسير السور التي يحفظها الطلاب، مع فوائد وتدبر.",lessons:[{id:"l1",title:"سورة الملك (1–14)",date:addDays(today(),-14),body:"• معنى «تبارك»\n• الحكمة من خلق الموت والحياة\n• فائدة: «ليبلوكم أيكم أحسن عملاً» ولم يقل أكثر عملاً",link:"https://quran.ksu.edu.sa/tafseer/"},{id:"l2",title:"سورة الملك (15–30)",date:addDays(today(),-7),body:"تأملات في نعمة الرزق والأمن."},{id:"l3",title:"سورة القلم (1–33)",date:today(),body:"قصة أصحاب الجنة ودروسها."}]});
  DEMO.programs.push({id:"pr2",title:"تحفة الأطفال",kind:"tajweed",audience:"all",description:"شرح متن تحفة الأطفال في أحكام النون الساكنة والتنوين والمدود.",lessons:[{id:"l4",title:"مقدمة وأحكام النون الساكنة",body:"الإظهار، الإدغام، الإقلاب، الإخفاء."},{id:"l5",title:"أحكام الميم الساكنة"},{id:"l6",title:"المدود وأقسامها"}]});
  DEMO.progress.push({id:"d-s1__pr1",studentId:"d-s1",programId:"pr1",done:["l1","l2"]},{id:"d-s1__pr2",studentId:"d-s1",programId:"pr2",done:["l4"]},{id:"d-s4__pr2",studentId:"d-s4",programId:"pr2",done:["l4","l5"]});
  DEMO.config.push({id:"main",...DEF_CFG,circleName:"حلقة الفرقان (تجريبية)",leaderboard:true,termName:"الفصل الأول",termStart:addDays(today(),-45),termEnd:addDays(today(),75),divisions:[{id:"dv1",name:"المرحلة المتوسطة",color:"#2c7a55"},{id:"dv2",name:"المرحلة الثانوية",color:"#284a70"}]});DEMO.circles.forEach(c=>{c.divisionId={c1:"dv1",c2:"dv2",c3:"dv1"}[c.id]||""});
  const s1=DEMO.members.find(x=>x.id==="d-s1");s1.msgStudent="ممتاز يا عبدالرحمن، هدفنا هذا الأسبوع إتمام سورة القلم مع تثبيت الملك.";s1.msgParent="الطالب منضبط، نرجو متابعة المراجعة اليومية في البيت قبل النوم.";
  const hm={"d-s1":{30:"x",29:"m",28:"r"},"d-s2":{30:"x",29:"x",28:"m",27:"m"},"d-s3":{30:"m"},"d-s4":{1:"m",2:"m",3:"m",4:"m",5:"m",6:"m"},"d-s5":{30:"m"}};DEMO.members.forEach(x=>{if(hm[x.id])x.hifzMap=hm[x.id]});
  DEMO.exams.push({id:"e1",studentId:"d-s1",date:addDays(today(),-20),scope:"جزء عم كاملاً",juzFrom:30,juzTo:30,score:96,errJali:0,errKhafi:2,tanbih:3,examiner:"d-admin",notes:"أداء متميز"},{id:"e2",studentId:"d-s2",date:addDays(today(),-12),scope:"جزءا عم وتبارك",juzFrom:29,juzTo:30,score:88,errJali:1,errKhafi:4,tanbih:5,examiner:"d-admin"},{id:"e3",studentId:"d-s3",date:addDays(today(),-5),scope:"من الناس إلى البروج",juzFrom:30,juzTo:30,score:74,errJali:3,errKhafi:5,tanbih:6,examiner:"d-t1",notes:"يحتاج تثبيت الانفطار"});
  DEMO.certs.push({id:"z1",studentId:"d-s1",title:"شهادة إتمام حفظ جزء عم",body:"لإتمامه حفظ جزء عم بإتقان في حلقة الفرقان، سائلين الله له التوفيق والسداد.",date:addDays(today(),-19),signer:"أ. خالد العتيبي",issuedBy:"d-admin"});
  DEMO.recits.push({id:"r1",studentId:"d-s1",teacherId:"d-admin",date:today(),createdAt:new Date().toISOString(),title:"سورة القلم 1–16",note:"راجعتها مرتين",status:"pending"},{id:"r2",studentId:"d-s4",teacherId:"d-admin",date:addDays(today(),-2),title:"سورة يس 1–20",status:"reviewed",grade:4,errJali:1,errKhafi:3,feedback:"انتبه لمدّ اللين ومواضع الإخفاء.",reviewedBy:"d-admin",reviewedAt:new Date().toISOString()});
  for(let i=13;i>=0;i--){const d=addDays(today(),-i);if(dow(d)>4)continue;["d-admin","d-t1"].forEach(t=>{const r=rnd();DEMO.tatt.push({id:`${t}_${d}`,teacherId:t,date:d,status:r<.82?"present":r<.92?"late":r<.96?"excused":"absent"})})}
  const s5=DEMO.logs.filter(l=>l.studentId==="d-s5").sort((a,b)=>a.date<b.date?1:-1);s5.slice(0,2).forEach(l=>{l.attendance="absent";["tSurah","tPages","tGrade","errJali","errKhafi"].forEach(k=>delete l[k])});
  {const G0=SURAHS.slice(0,66).reduce((x,s)=>x+s.a,0);const L1=DEMO.logs.filter(l=>l.studentId==="d-s1"&&l.attendance!=="absent").sort((a,b)=>a.date<b.date?1:-1);
   if(L1[0])Object.assign(L1[0],{tanbih:2,talqin:1,marks:[{g:G0+1,w:1,c:1,h:0,t:"t"},{g:G0+2,w:3,c:null,h:null,t:"l"},{g:G0+4,w:0,c:2,h:null,t:"t"}],noteStudent:"أحسنت في التسميع، انتبه لمدّ «تَبَٰرَكَ» وراجع الآية الثالثة قبل الدرس القادم.",tajweed:["المدود"]});
   if(L1[1])Object.assign(L1[1],{tanbih:1,talqin:1,marks:[{g:G0+1,w:1,c:1,h:0,t:"t"},{g:G0+6,w:2,c:null,h:null,t:"l"}]});}
  {const c1=DEMO.circles.find(c=>c.id==="c1");if(c1)c1.challenge={title:"ختمة الحلقة الجماعية",desc:"نجمع أوجه الحفظ والتلاوة لكل طلاب الحلقة حتى نتمّ ختمة كاملة",kind:"pages",target:604,from:addDays(today(),-20),to:addDays(today(),10)};
   const pr=DEMO.programs.find(p=>p.id==="pr2");const at=new Date();at.setDate(at.getDate()+2);at.setHours(20,30,0,0);
   if(pr)pr.lessons.push({id:"l7",kind:"meeting",title:"لقاء: معاني اسم الله «الرحمن»",at:at.toISOString(),meetLink:"https://meet.google.com/abc-defg-hij",body:"لقاء أسبوعي ضمن برنامج أسماء الله الحسنى"},{id:"l8",kind:"message",title:"«خيركم من تعلّم القرآن وعلّمه»",date:today(),body:"كل آية تحفظها اليوم نور لك في الدنيا والآخرة، استمر!"})}
  const ago=h=>new Date(Date.now()-h*3600000).toISOString();
  DEMO.messages.push({id:"m1",fromId:"d-p1",toId:"d-admin",studentId:"d-s1",body:"السلام عليكم أستاذ خالد، عبدالرحمن عنده اختبار مدرسي الأسبوع القادم، هل يمكن تخفيف المقرر يومين؟",at:ago(30),readAt:ago(29)},{id:"m2",fromId:"d-admin",toId:"d-p1",studentId:"d-s1",body:"وعليكم السلام، لا بأس، نجعلها مراجعة فقط يومي الأحد والاثنين، ونعود بعدها للمقرر.",at:ago(28),readAt:ago(20)},{id:"m3",fromId:"d-p1",toId:"d-admin",studentId:"d-s1",body:"جزاك الله خيراً.",at:ago(19)},{id:"m4",fromId:"d-admin",toId:"d-s1",studentId:"d-s1",body:"أحسنت في تسميع سورة الملك اليوم، ركّز غداً على الآيات 15 إلى 20.",at:ago(3)});
  ui.demoAs="d-admin";ui.view=null;render();
}

/* ============ خريطة الحفظ ============ */
const JUZ_NAMES=["الم","سيقول","تلك الرسل","لن تنالوا","والمحصنات","لا يحب الله","وإذا سمعوا","ولو أننا","قال الملأ","واعلموا","يعتذرون","وما من دابة","وما أبرئ","ربما","سبحان","قال ألم","اقترب","قد أفلح","وقال الذين","أمن خلق","اتل ما أوحي","ومن يقنت","وما لي","فمن أظلم","إليه يرد","حم","قال فما خطبكم","قد سمع","تبارك","عم"];
const JST={m:["محفوظ","jm"],x:["متقن","jx"],r:["يحتاج مراجعة","jr"]};
function juzMapHTML(s,staff){
  const mp=s.hifzMap||{};const cnt={x:0,r:0};Object.values(mp).forEach(v=>{const k=v==="m"?"x":v;if(cnt[k]!=null)cnt[k]++});
  const isT=s.track==="tilawa";
  const dm=staff&&ui.jdel===s.id;const any=Object.keys(mp).length;
  return `<div class="card jmap ${dm?"jdel-on":""}"><div class="card-h"><h2>${isT?"خريطة التلاوة":"خريطة الحفظ"}</h2>${staff?`<div class="row jtools"><button class="btn sm ${dm?"danger":""}" data-act="jdelMode" data-sid="${s.id}" aria-pressed="${dm}" ${any||dm?"":"disabled"}>${dm?"إيقاف الحذف":"وضع الحذف"}</button><button class="btn sm ghost danger" data-act="jdelAll" data-sid="${s.id}" ${any?"":"disabled"}>حذف الكل</button></div>`:""}</div>${dm?`<div class="jdel-bar">وضع الحذف مفعّل: اضغط أي جزء لمسح علامته. اضغط «إيقاف الحذف» للعودة.</div>`:""}<div class="legend" style="margin-bottom:10px">${Object.entries(JST).filter(([k])=>k!=="m").map(([k,[l,c]])=>`<span><i class="jdot ${c}"></i>${l} (${cnt[k]})</span>`).join("")}</div>
  <div class="jgrid">${Array.from({length:30},(_,i)=>{const j=i+1,v=mp[j]==="m"?"x":mp[j];return `<button class="jc ${v?JST[v][1]:""}" ${staff?`data-act="juz" data-sid="${s.id}" data-j="${j}"`:"disabled"} title="الجزء ${j}${v?": "+JST[v][0]:""}"><b class="num">${j}</b><span>${JUZ_NAMES[i]}</span></button>`}).join("")}</div>
  ${staff?`<p class="hint" style="margin-top:8px">اضغط الجزء لتغيير حالته: متقن ← يحتاج مراجعة ← بدون علامة.</p>`:""}</div>`;
}

/* ============ الاختبارات ============ */
const examGrade=sc=>{sc=n0(sc);return sc>=95?["ممتاز مرتفع","p-ok"]:sc>=90?["ممتاز","p-ok"]:sc>=80?["جيد جداً","p-pri"]:sc>=70?["جيد","p-acc"]:sc>=60?["مقبول","p-warn"]:["لم يجتز","p-bad"]};
const examsOf=(sid,f,t)=>S.exams.filter(e=>e.studentId===sid&&(!f||e.date>=f)&&(!t||e.date<=t)).sort((a,b)=>a.date<b.date?1:-1);
function examsTable(list,staff){
  if(!list.length)return empty("لا اختبارات مسجّلة.");
  return `<div class="tbl-wrap"><table><thead><tr><th>التاريخ</th><th>المقرر</th><th>الدرجة</th><th>التقدير</th><th>تنبيهات</th><th>تلقين</th><th>المختبِر</th><th>ملاحظات</th>${staff?"<th></th>":""}</tr></thead><tbody>${list.map(e=>{const[g,c]=examGrade(e.score);return `<tr><td class="num">${fmtShort(e.date)}</td><td>${esc(e.scope||"")}</td><td class="num"><b>${n0(e.score)}</b>/100</td><td><span class="pill ${c}">${g}</span></td><td class="num">${n0(e.tanbih)}</td><td class="num">${n0(e.talqin)}</td><td>${esc(nameOf(e.examiner))}</td><td class="wrapc">${esc(e.notes||"")}</td>${staff?`<td><button class="btn ghost sm" data-act="editExam" data-id="${e.id}">تعديل</button></td>`:""}</tr>`}).join("")}</tbody></table></div>`;
}
function examForm(e,sid){
  e=e||{date:today()};sid=e.studentId||sid;
  const jz=[["","—"],...Array.from({length:30},(_,i)=>[i+1,`${i+1}. ${JUZ_NAMES[i]}`])];
  const body=`<div class="fg">${fld("التاريخ",inp("date",e.date,"date","required"))}${fld("المقرر",inp("scope",e.scope,"text","required placeholder='مثال: جزء عم كاملاً'"))}</div>
  <div class="fg">${fld("من الجزء",sel("juzFrom",jz,e.juzFrom))}${fld("إلى الجزء",sel("juzTo",jz,e.juzTo))}</div>
  <div class="fg">${fld("الدرجة من 100",inp("score",e.score,"number","required min=0 max=100 step=0.5"))}${fld("تنبيهات",inp("tanbih",e.tanbih,"number","min=0"))}${fld("تلقين",inp("talqin",e.talqin,"number","min=0"))}</div>
  ${fld("ملاحظات",`<textarea name="notes" id="f-notes">${esc(e.notes||"")}</textarea>`)}
  <label class="switch" style="border:0;padding:0"><span>عند الاجتياز (70 فأعلى) اعتمد الأجزاء «متقنة» في خريطة الحفظ</span><input type="checkbox" name="markJuz" id="f-markJuz" ${e.id?"":"checked"}></label>`;
  openModal(e.id?"تعديل الاختبار":`اختبار: ${esc(nameOf(sid))}`,body,"exam",{id:e.id,sid},"حفظ",e.id?`<button type="button" class="btn danger" data-act="delExam" data-id="${e.id}">حذف</button>`:"");
}

/* ============ الشهادات ============ */
function certsList(sid,staff){
  const L=S.certs.filter(c=>c.studentId===sid).sort((a,b)=>a.date<b.date?1:-1);
  if(!L.length)return staff?empty("لا شهادات بعد."):"";
  return `<div class="grid g3">${L.map(c=>`<div class="cert-card"><div class="cert-ic">${STAR}</div><div style="min-width:0;flex:1"><b>${esc(c.title)}</b><div class="small muted">${fmtShort(c.date)}</div></div><div class="row"><button class="btn sm pri" data-act="certDl" data-id="${c.id}">تحميل</button>${staff?`<button class="btn ghost sm danger" data-act="delCert" data-id="${c.id}">حذف</button>`:""}</div></div>`).join("")}</div>`;
}
const CERT_SUG=["شهادة إتمام حفظ جزء عم","شهادة إتمام حفظ جزء تبارك","شهادة إتمام حفظ خمسة أجزاء","شهادة ختم القرآن الكريم","شهادة إتمام برنامج التلاوة المجوّدة","شهادة تميّز","شهادة إتمام برنامج تفسير"];
let CERT_PRE="";
function certForm(sid){
  const s=get("members",sid);const c=cfg();
  const L=uiCfg().lists||{};const sug=L.certs&&L.certs.length?L.certs:CERT_SUG;const _x=["شهادة إتمام حفظ جزء تبارك","شهادة إتمام حفظ خمسة أجزاء","شهادة ختم القرآن الكريم","شهادة إتمام برنامج التلاوة المجوّدة","شهادة تميّز","شهادة إتمام برنامج تفسير"];
  const body=`${fld("عنوان الشهادة",`<input name="title" id="f-title" list="cert-sug" required value="${esc((()=>{const v=CERT_PRE||sug[0];CERT_PRE="";return v})())}"><datalist id="cert-sug">${sug.map(x=>`<option value="${x}">`).join("")}</datalist>`)}
  ${fld("نص الشهادة",`<textarea name="body" id="f-body" style="min-height:90px">لإتمامه ${s.track==="tilawa"?"برنامج التلاوة المجوّدة":"حفظ المقرر"} في ${esc(c.circleName)} بإتقان، سائلين الله له التوفيق والسداد، وأن يجعله من أهل القرآن الذين هم أهل الله وخاصته.</textarea>`)}
  <div class="fg">${fld("التاريخ",inp("date",today(),"date"))}${fld("اسم الموقِّع",inp("signer",me().name))}</div>`;
  openModal(`شهادة: ${esc(s.name)}`,body,"cert",{sid},"إصدار الشهادة");
}
function wrapLines(x,text,maxW){const words=String(text).split(/\s+/);const lines=[];let cur="";words.forEach(w=>{const t=cur?cur+" "+w:w;if(x.measureText(t).width>maxW&&cur){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);return lines}
async function certBlob(c){
  const s=get("members",c.studentId)||{name:""};const W=1754,H=1240;const cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d");
  try{await Promise.all([document.fonts.load('800 60px Tajawal'),document.fonts.load('500 30px Tajawal')])}catch(e){}
  x.fillStyle="#fffdf7";x.fillRect(0,0,W,H);
  x.strokeStyle="#284a70";x.lineWidth=16;x.strokeRect(36,36,W-72,H-72);
  x.strokeStyle="#c9a53a";x.lineWidth=3;x.strokeRect(70,70,W-140,H-140);
  const orn=(cx,cy)=>{x.save();x.translate(cx,cy);x.strokeStyle="#c9a53a";x.lineWidth=3;x.strokeRect(-22,-22,44,44);x.rotate(Math.PI/4);x.strokeRect(-22,-22,44,44);x.restore()};
  [[110,110],[W-110,110],[110,H-110],[W-110,H-110]].forEach(([a,b])=>orn(a,b));
  const img=new Image();img.src=logoFull();try{await img.decode();x.drawImage(img,W/2-70,105,140,215)}catch(e){}
  x.direction="rtl";x.textAlign="center";
  x.fillStyle="#284a70";x.font='800 72px Tajawal, Tahoma, sans-serif';x.fillText(c.title,W/2,420);
  x.fillStyle="#6a7686";x.font='500 30px Tajawal, Tahoma, sans-serif';x.fillText(`${cfg().circleName}${brand().tagline?" · "+brand().tagline:""}`,W/2,470);
  x.fillStyle="#1c2a3b";x.font='500 38px Tajawal, Tahoma, sans-serif';x.fillText("تتشرّف إدارة الحلقة بمنح الطالب",W/2,575);
  x.fillStyle="#a8862a";x.font='800 76px Tajawal, Tahoma, sans-serif';x.fillText(s.name,W/2,672);
  x.fillStyle="#1c2a3b";x.font='500 36px Tajawal, Tahoma, sans-serif';wrapLines(x,c.body||"",1250).slice(0,4).forEach((l,i)=>x.fillText(l,W/2,760+i*58));
  x.font='500 28px Tajawal, Tahoma, sans-serif';x.fillStyle="#5b6979";
  x.textAlign="right";x.fillText("التاريخ: "+fmtD(c.date,{day:"numeric",month:"long",year:"numeric"}),W-200,H-190);x.fillText(hijri(new Date(c.date+"T12:00:00")),W-200,H-148);
  x.textAlign="left";x.fillText("المعلم: "+(c.signer||nameOf(c.issuedBy)),200,H-190);x.strokeStyle="#c9a53a";x.lineWidth=2;x.beginPath();x.moveTo(200,H-140);x.lineTo(520,H-140);x.stroke();
  return new Promise(r=>cv.toBlob(r,"image/png"));
}
async function downloadCert(id){
  const c=get("certs",id);if(!c)return;toast("جاري تجهيز الشهادة…");const blob=await certBlob(c);const name=`شهادة-${(nameOf(c.studentId)||"").replace(/\s+/g,"-")}.png`;
  if(DL){try{await DL.save({filename:name,data:blob});return}catch(e){if(e&&e.code==="declined")return}}
  const url=URL.createObjectURL(blob);openModal(esc(c.title),`<img src="${url}" alt="الشهادة" style="width:100%;border-radius:8px;border:1px solid var(--line)"><p class="hint">اضغط مطولاً على الصورة أو انقر بالزر الأيمن لحفظها.</p>`,"noop",{},"إغلاق");
}

/* ============ التنبيهات ============ */
function alertsFor(st){
  const out=[];const d=today();
  st.forEach(s=>{const L=logsOf(s.id).filter(l=>l.date<=d);
    let n=0;for(const l of L){if(l.attendance==="absent")n++;else break}
    if(n>=2)out.push({s,k:"absent",n,t:`غاب ${n} مرات متتالية`});
    const miss=tasksOf(s.id,addDays(d,-3),addDays(d,-1)).filter(t=>!t.done).length;if(miss>=3)out.push({s,k:"tasks",n:miss,t:`لم يُنجز ${miss} مهام في آخر 3 أيام`});
    if(!L.length||L[0].date<addDays(d,-7))out.push({s,k:"idle",t:L.length?"لا متابعة منذ أكثر من أسبوع":"لم تُسجَّل له أي متابعة بعد"});
    if(s.plan){const g=goalInfo(s);if(g.pct>=100&&!S.exams.some(e=>e.studentId===s.id&&(!g.from||e.date>=g.from)))out.push({s,k:"exam",t:"أتمّ هدف خطته، وهو جاهز للاختبار"})}
  });return out;
}
function staffAlerts(m){
  const A=alertsFor(myStudents(m));if(!A.length)return"";
  return `<div class="card alert-card"><div class="card-h"><h2>تنبيهات تحتاج متابعة</h2><span class="pill p-bad">${A.length}</span></div><div class="list">${A.slice(0,12).map(a=>`<div class="li"><span class="pill ${a.k==="absent"?"p-bad":a.k==="tasks"?"p-warn":a.k==="exam"?"p-ok":""}">${a.k==="absent"?"غياب":a.k==="tasks"?"مهام":a.k==="exam"?"اختبار":"انقطاع"}</span><div class="grow clickable" data-act="openStudent" data-id="${a.s.id}"><div class="t">${esc(a.s.name)}</div><div class="small muted">${a.t}</div></div>${a.k==="exam"?`<button class="btn sm pri" data-act="examFromGoal" data-id="${a.s.id}">جدولة اختبار</button>`:`<button class="btn sm" data-act="alertMsg" data-id="${a.s.id}" data-k="${a.k}" data-n="${a.n||0}">رسالة لولي الأمر</button>`}</div>`).join("")}</div></div>`;
}
const waNum=p=>{let d=String(p||"").replace(/\D/g,"");if(d.startsWith("00"))d=d.slice(2);if(d.startsWith("05")&&d.length===10)d="966"+d.slice(1);else if(d.startsWith("5")&&d.length===9)d="966"+d;return d.length>=11?d:""};
function alertMsgText(s,k,n){
  const c=cfg();const t=nameOf(s.teacherId);
  const body=k==="absent"?`نفيدكم بأن ابنكم تغيّب عن الحلقة ${n} مرات متتالية، ونأمل حرصكم على انتظامه في الحضور، ونسعد بتواصلكم معنا إن كان هناك عذر.`:
    k==="tasks"?`نفيدكم بأن ابنكم لم يُنجز ${n} من مهامه اليومية في الأيام الثلاثة الماضية، ونأمل متابعته في البيت وتشجيعه على الإنجاز.`:
    `نود الاطمئنان على ابنكم، فلم تُسجَّل له متابعة في الحلقة منذ مدة، ونأمل التواصل معنا.`;
  return `السلام عليكم ورحمة الله وبركاته\nولي أمر الطالب ${s.name} الكريم،\n${body}\nجزاكم الله خيراً.\n${t} — ${c.circleName}`;
}

/* ============ الأوسمة ============ */
function badges(sid){
  const s=get("members",sid);if(!s)return[];const b=[];const L=logsOf(sid);const d=today();const[mf,mt]=monthRange(d.slice(0,7));
  const last5=L.slice(0,5);if(last5.length===5&&last5.every(l=>l.attendance==="present"))b.push(["منتظم","5 لقاءات متتالية دون غياب أو تأخر"]);
  const st=streak(sid);if(st>=7)b.push(["سلسلة ذهبية",`${st} أيام متتالية بإنجاز كامل`]);else if(st>=3)b.push(["سلسلة إنجاز",`${st} أيام متتالية بإنجاز كامل`]);
  const x=stats(sid,mf,mt);const ex=x.logs.reduce((a,l)=>a+[l.newGrade,l.revGrade,l.tGrade].filter(g=>n0(g)===5).length,0);if(ex>=10)b.push(["متقن",`${ex} تقدير ممتاز هذا الشهر`]);
  const jz=Object.values(s.hifzMap||{}).filter(v=>v==="m"||v==="x").length;if(jz>=1)b.push([jz===1?"حافظ جزء":jz===2?"حافظ جزأين":`حافظ ${jz} ${jz<=10?"أجزاء":"جزءاً"}`,"حسب خريطة الحفظ"]);
  if(S.exams.some(e=>e.studentId===sid&&n0(e.score)>=95))b.push(["متفوق","درجة 95 فأعلى في اختبار"]);
  if(x.tPages>=40)b.push(["قارئ مجتهد",`${x.tPages} وجه تلاوة هذا الشهر`]);
  const wk=tasksOf(sid,addDays(d,-6),d);if(wk.length>=5&&wk.every(t=>t.done))b.push(["منجز","أنجز كل مهام الأسبوع"]);
  if(S.certs.some(c=>c.studentId===sid))b.push(["حاصل على شهادة",S.certs.filter(c=>c.studentId===sid).length+" شهادة"]);
  return b;
}
function badgesHTML(sid,title){const b=badges(sid);if(!b.length)return"";return `<div class="card"><div class="card-h"><h2>${title||"الأوسمة"}</h2></div><div class="badges">${b.map(([t,h])=>`<span class="badge"><i aria-hidden="true">✦</i><span><b>${esc(t)}</b><small>${esc(h)}</small></span></span>`).join("")}</div></div>`}

/* ============ التسميع الصوتي ============ */
const recitsOf=sid=>S.recits.filter(r=>r.studentId===sid).sort((a,b)=>(a.createdAt||a.date)<(b.createdAt||b.date)?1:-1);
function recitItem(r,staff){
  const st=r.status==="reviewed";
  return `<div class="lesson"><div class="row between"><div><b>${esc(r.title||"تسميع")}</b>${staff?` · <span class="muted">${esc(nameOf(r.studentId))}</span>`:""}<div class="small muted">${fmtShort(r.date)}${r.note?" · "+esc(r.note):""}</div></div><div class="row"><span class="pill ${st?"p-ok":"p-warn"}">${st?"قُيّم":"بانتظار التقييم"}</span>${st&&n0(r.grade)?`<span class="pill ${gradeCls(r.grade)}">${gradeTxt(r.grade)}</span>`:""}${staff?`<button class="btn sm ${st?"":"pri"}" data-act="reviewRecit" data-id="${r.id}">${st?"تعديل التقييم":"استماع وتقييم"}</button>`:""}</div></div>
  ${r.fileUrl?`<audio controls preload="none" src="${esc(r.fileUrl)}" style="width:100%"></audio>`:`<div class="hint">ملف تجريبي بدون صوت</div>`}
  ${st&&(r.feedback||errShort(r)!=="—")?`<div class="small"><b>ملاحظات المعلم:</b> ${esc(r.feedback||"")}${errShort(r)!=="—"?" · "+errShort(r):""}</div>`:""}</div>`;
}
function reciteView(m){
  const L=recitsOf(m.id);
  return `<div class="hero"><div><h1>التسميع الصوتي</h1><div class="date">سجّل تسميعك بالجوال وارفعه، ويستمع له معلمك ويقيّمه.</div></div></div>
  <div class="card"><h2 style="margin-bottom:10px">تسميع جديد</h2>${ASSETS||MODE==="demo"?`<form class="stack" data-form="recit">${recUI()}<div class="fg">${fld("المقطع المسمَّع",inp("title","","text","required placeholder='مثال: سورة الملك 1–15'"))}${fld("ملف الصوت",`<input type="file" name="file" id="f-rfile" accept="audio/*">`,"سجّل بتطبيق التسجيل في جوالك ثم اختر الملف، حتى 20 ميجابايت.")}</div>${fld("ملاحظة لمعلمك (اختياري)",inp("note",""))}<div><button class="btn pri">إرسال التسميع</button></div></form>`:`<p class="muted">رفع الملفات غير متاح لحسابك حالياً. اطلب من المشرف منحك صلاحية «مساهم» أو أعلى على المنصة.</p>`}</div>
  <div class="stack">${L.length?L.map(r=>recitItem(r,false)).join(""):empty("لم ترسل أي تسميع صوتي بعد.")}</div>`;
}
function recitReviewForm(r){
  const body=`<p><b>${esc(nameOf(r.studentId))}</b> · ${esc(r.title||"")} · <span class="muted">${fmtShort(r.date)}</span></p>${r.note?`<p class="small muted">ملاحظة الطالب: ${esc(r.note)}</p>`:""}
  ${r.fileUrl?`<audio controls src="${esc(r.fileUrl)}" style="width:100%"></audio>`:`<p class="hint">ملف تجريبي بدون صوت</p>`}
  <div class="fg">${fld("التقدير",gradeSel("grade",r.grade))}${errFields(r)}</div>
  ${fld("ملاحظاتك للطالب",`<textarea name="feedback" id="f-feedback">${esc(r.feedback||"")}</textarea>`)}`;
  openModal("تقييم التسميع الصوتي",body,"recitReview",{id:r.id},"حفظ التقييم",`<button type="button" class="btn danger" data-act="delRecit" data-id="${r.id}">حذف</button>`);
}
function pendingRecits(m){
  const ids=new Set(myStudents(m).map(s=>s.id));const L=S.recits.filter(r=>r.status!=="reviewed"&&ids.has(r.studentId)).sort((a,b)=>a.date<b.date?-1:1);
  if(!L.length)return"";return `<div class="card"><div class="card-h"><h2>تسميع وأوراد بانتظار تأكيدك</h2><span class="pill p-warn">${L.length}</span></div><div class="list">${L.slice(0,8).map(r=>`<div class="li"><div class="avatar">${esc(initials(nameOf(r.studentId)))}</div><div class="grow"><div class="t">${esc(nameOf(r.studentId))}</div><div class="small muted">${esc(r.title||"")} · ${fmtShort(r.date)}</div></div>${r.kind==="self"?`<span class="sw-k sw-${esc(r.wtype||"hifz")}">${esc((SW_T[r.wtype]||SW_T.hifz)[0])}${r.pages?" · "+esc(String(r.pages))+" وجه":""}</span><button class="btn sm pri" data-act="selfReview" data-id="${r.id}">مراجعة وتأكيد</button>`:`<button class="btn sm pri" data-act="reviewRecit" data-id="${r.id}">استماع وتقييم</button>`}</div>`).join("")}</div></div>`;
}

/* ============ لوحة المشرف ============ */
const TATT={present:["ح","حاضر","p-ok"],late:["ت","متأخر","p-warn"],absent:["غ","غائب","p-bad"],excused:["م","مستأذن","p-info"]};
const mbar=(v,max)=>{const p=max?Math.max(0,Math.min(100,Math.round(v/max*100))):0;return `<div class="mbar"><i style="width:${p}%"></i></div>`};
function circleAgg(ids,f,t){
  let pres=0,cnt=0,np=0,tp=0,gs=[],td=0,tt=0;
  ids.forEach(id=>{const x=stats(id,f,t);pres+=x.att.present+x.att.late;cnt+=x.att.present+x.att.late+x.att.absent;np+=x.newPages;tp+=x.tPages;if(x.avg)gs.push(x.avg);td+=x.done;tt+=x.tasks});
  const ex=S.exams.filter(e=>ids.includes(e.studentId)&&e.date>=f&&e.date<=t);
  return{rate:cnt?Math.round(pres/cnt*100):null,np,tp,avg:gs.length?gs.reduce((a,b)=>a+b,0)/gs.length:0,task:tt?Math.round(td/tt*100):null,td,tt,ex:ex.length?Math.round(ex.reduce((a,e)=>a+n0(e.score),0)/ex.length):null,exn:ex.length,alerts:alertsFor(ids.map(id=>get("members",id)).filter(Boolean)).length};
}
function adminView(m){
  if(!can(m,"admin.dashboard"))return empty("ليست لديك صلاحية لوحة المشرف.");
  const[f,t]=curRange();const cs=myCircles(m);const mine=myStudents(m);
  const rows=cs.map(c=>({c,ids:circleStudents(c.id).map(s=>s.id)}));const none=mine.filter(s=>!s.circleId||!get("circles",s.circleId)).map(s=>s.id);if(none.length)rows.push({c:null,ids:none});
  const R=rows.map(r=>({...r,a:circleAgg(r.ids,f,t)}));
  const all=circleAgg(mine.map(s=>s.id),f,t);
  const T=isAdmin(m)?teachers():teachers().filter(x=>cs.some(c=>c.teacherId===x.id));const days=[...Array(14)].map((_,i)=>addDays(today(),i-13));
  return `<div class="hero"><div><h1>لوحة المشرف</h1><div class="date">مقارنة الحلقات ومتابعة المعلمين</div></div></div>${periodPicker()}
  <div class="stats"><div class="stat"><b>${mine.length}</b><span>طالب</span></div><div class="stat"><b>${cs.length}</b><span>حلقة</span></div><div class="stat"><b>${T.length}</b><span>معلم</span></div><div class="stat"><b>${all.rate==null?"—":all.rate+"%"}</b><span>متوسط الحضور</span></div><div class="stat"><b>${all.task==null?"—":all.task+"%"}</b><span>إنجاز المهام</span></div><div class="stat"><b>${all.np+all.tp}</b><span>أوجه حفظ وتلاوة</span></div><div class="stat"><b>${all.ex==null?"—":all.ex}</b><span>متوسط الاختبارات</span></div><div class="stat"><b>${all.alerts}</b><span>تنبيهات مفتوحة</span></div></div>
  ${divCompare(m,f,t)}<div class="card"><div class="card-h"><h2>مقارنة الحلقات</h2></div>${R.length?`<div class="tbl-wrap"><table><thead><tr><th>الحلقة</th><th>المعلم</th><th>الطلاب</th><th style="min-width:150px">الحضور</th><th style="min-width:150px">إنجاز المهام</th><th>حفظ جديد</th><th>تلاوة</th><th>متوسط التقدير</th><th>الاختبارات</th><th>تنبيهات</th></tr></thead><tbody>
  ${R.map(({c,ids,a})=>`<tr ${c?`class="clickable" data-act="openCircle" data-id="${c.id}"`:""}><td><b>${c?esc(c.name):"بدون حلقة"}</b></td><td>${c?esc(nameOf(c.teacherId)):"—"}</td><td class="num">${ids.length}</td><td><div class="row" style="flex-wrap:nowrap">${mbar(a.rate||0,100)}<span class="num small">${a.rate==null?"—":a.rate+"%"}</span></div></td><td><div class="row" style="flex-wrap:nowrap">${mbar(a.task||0,100)}<span class="num small">${a.task==null?"—":a.task+"%"}</span></div></td><td class="num">${a.np}</td><td class="num">${a.tp}</td><td><span class="pill ${gradeCls(a.avg)}">${a.avg?a.avg.toFixed(1):"—"}</span></td><td class="num">${a.ex==null?"—":a.ex+" ("+a.exn+")"}</td><td>${a.alerts?`<span class="pill p-bad">${a.alerts}</span>`:'<span class="pill p-ok">0</span>'}</td></tr>`).join("")}</tbody></table></div>`:empty("لا حلقات بعد.")}</div>
  <div class="card"><div class="card-h"><h2>المعلمون</h2><span class="small muted">${periodLabel([f,t])}</span></div>${T.length?`<div class="tbl-wrap"><table><thead><tr><th>المعلم</th><th>الحلقات</th><th>الطلاب</th><th>سجلات المتابعة</th><th>أيام حضوره</th><th>تأخر/غياب</th><th>تسميعات قيّمها</th><th>اختبارات أجراها</th></tr></thead><tbody>${T.map(tc=>{const A=S.tatt.filter(a=>a.teacherId===tc.id&&a.date>=f&&a.date<=t);return `<tr><td><b>${esc(tc.name)}</b></td><td class="num">${S.circles.filter(c=>c.teacherId===tc.id).length}</td><td class="num">${mine.filter(s=>s.teacherId===tc.id).length}</td><td class="num">${S.logs.filter(l=>l.teacherId===tc.id&&l.date>=f&&l.date<=t).length}</td><td class="num">${A.filter(a=>a.status==="present"||a.status==="late").length}</td><td class="num">${A.filter(a=>a.status==="late").length}/${A.filter(a=>a.status==="absent").length}</td><td class="num">${S.recits.filter(r=>r.reviewedBy===tc.id&&(r.reviewedAt||"").slice(0,10)>=f&&(r.reviewedAt||"").slice(0,10)<=t).length}</td><td class="num">${S.exams.filter(e=>e.examiner===tc.id&&e.date>=f&&e.date<=t).length}</td></tr>`}).join("")}</tbody></table></div>`:empty("لا معلمين.")}</div>
  <div class="card"><div class="card-h"><h2>سجل حضور المعلمين</h2><span class="small muted">آخر 14 يوماً · اضغط الخانة للتبديل: حاضر ← متأخر ← غائب ← مستأذن ← فارغ</span></div>${T.length?`<div class="tbl-wrap"><table class="tatt"><thead><tr><th>المعلم</th>${days.map(d=>`<th class="${d===today()?"today":""}">${fmtD(d,{weekday:"short"})}<br><span class="num">${fmtD(d,{day:"numeric",month:"numeric"})}</span></th>`).join("")}</tr></thead><tbody>${T.map(tc=>`<tr><td><b>${esc(tc.name)}</b></td>${days.map(d=>{const a=get("tatt",`${tc.id}_${d}`);const st=a&&TATT[a.status];const lc=S.logs.filter(l=>l.teacherId===tc.id&&l.date===d).length;return `<td class="${d===today()?"today":""}"><button class="tcell ${st?st[2]:""}" data-act="tatt" data-id="${tc.id}" data-d="${d}" title="${st?st[1]:"لم يُسجَّل"}${lc?" · "+lc+" سجل متابعة":""}">${st?st[0]:"·"}</button>${lc?`<div class="tiny num">${lc}</div>`:""}</td>`}).join("")}</tr>`).join("")}</tbody></table></div><p class="hint" style="margin-top:6px">الرقم أسفل الخانة = عدد سجلات المتابعة التي أدخلها المعلم ذلك اليوم.</p>`:""}</div>
  ${(()=>{const A=alertsFor(mine);return A.length?`<div class="card"><div class="card-h"><h2>كل التنبيهات</h2><span class="pill p-bad">${A.length}</span></div><div class="list">${A.map(a=>`<div class="li"><div class="grow clickable" data-act="openStudent" data-id="${a.s.id}"><div class="t">${esc(a.s.name)} <span class="small muted">· ${esc((get("circles",a.s.circleId)||{}).name||"")} · ${esc(nameOf(a.s.teacherId))}</span></div><div class="small muted">${a.t}</div></div><button class="btn sm" data-act="alertMsg" data-id="${a.s.id}" data-k="${a.k}" data-n="${a.n||0}">رسالة لولي الأمر</button></div>`).join("")}</div></div>`:""})()}`;
}

/* ============ المصحف ============ */
let Q=null,QLOAD=null;
const AR_D=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
function loadQuran(){
  if(Q||QLOAD)return;
  QLOAD=fetch("quran.json").then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{Q=d;Q.ss=[];let c=0;Q.s.forEach(([n,a])=>{Q.ss.push(c);c+=a});render()}).catch(()=>{QLOAD="err";render()});
}
function sa(g){let lo=0,hi=Q.ss.length-1;while(lo<hi){const mid=(lo+hi+1)>>1;if(Q.ss[mid]<=g)lo=mid;else hi=mid-1}return[lo,g-Q.ss[lo]+1]}
function pageOf(g){let lo=0,hi=603;while(lo<hi){const mid=(lo+hi+1)>>1;if(Q.p[mid]<=g)lo=mid;else hi=mid-1}return lo+1}
function juzOf(g){let k=0;for(let i=0;i<30;i++)if(Q.j[i]<=g)k=i;return k+1}
const JUZ_ORD=["الأول","الثاني","الثالث","الرابع","الخامس","السادس","السابع","الثامن","التاسع","العاشر","الحادي عشر","الثاني عشر","الثالث عشر","الرابع عشر","الخامس عشر","السادس عشر","السابع عشر","الثامن عشر","التاسع عشر","العشرون","الحادي والعشرون","الثاني والعشرون","الثالث والعشرون","الرابع والعشرون","الخامس والعشرون","السادس والعشرون","السابع والعشرون","الثامن والعشرون","التاسع والعشرون","الثلاثون"];
function mushafView(m){
  if(!Q){loadQuran();return `<div class="hero"><h1>المصحف الشريف</h1></div>${QLOAD==="err"?empty("تعذّر تحميل المصحف. تحقق من الاتصال ثم أعد فتح الصفحة."):empty("جاري تحميل المصحف…")}`}
  if(ui.msurah){const i=SURAHS.findIndex(x=>ui.msurah.includes(x.n));if(i>=0)ui.mpage=pageOf(Q.ss[i]);ui.msurah=null}
  const pg=Math.min(604,Math.max(1,ui.mpage||1));ui.mpage=pg;
  const staff=isStaff(m);const tm=staff&&ui.tasmee;HEATM=null;if(!MQ&&MQLOAD!=="err")loadMushaf();
  const cnt={t:0,l:0};Object.values(ui.marks).forEach(v=>{if(v)cnt[MT(v.t)]++});
  return `${heatBar(m,pg,tm)}
  ${staff?`<div class="card tasmee ${tm?"on":""}"><div class="row between"><label class="row"><input type="checkbox" id="m-tm" data-change="tasmee" ${tm?"checked":""} style="width:18px;height:18px;accent-color:var(--primary)"><b>وضع التسميع</b></label>
   ${tm?`<div class="row"><select id="m-stu" data-change="mStu"><option value="">— الطالب —</option>${myStudents(m).filter(s=>canAttend(m,s)).map(s=>`<option value="${s.id}" ${ui.mstu===s.id?"selected":""}>${esc(s.name)}</option>`).join("")}</select>
   <span class="mlegend mt-t"><span class="dot"></span>تنبيه <b class="num">${cnt.t}</b></span><span class="mlegend mt-l"><span class="dot"></span>تلقين <b class="num">${cnt.l}</b></span>
   <button class="btn sm pri" data-act="saveTasmee" ${ui.mstu&&(cnt.t+cnt.l)?"":"disabled"}>حفظ في سجل اليوم</button><button class="btn sm" data-act="clearMarks">مسح العلامات</button></div>`:`<span class="hint">فعّله أثناء تسميع الطالب، ثم اضغط على الكلمة في المصحف لتعليم الملاحظة.</span>`}</div>
   ${tm?`<p class="hint" style="margin-top:6px">اضغط الكلمة: <b>الأولى</b> <b style="color:var(--yel)">تنبيه</b>، <b>الثانية</b> <b style="color:var(--red)">تلقين</b>، <b>الثالثة</b> تزيلها. الضغط المطوّل على الآية يفتح خياراتها.</p>`:""}</div>`:""}
  <div id="rd-host" class="rd-host" style="${RD._hostH?`height:${RD._hostH}px`:""}"></div>
  <p class="hint rd-attr">النص بخط مجمع الملك فهد لطباعة المصحف الشريف، وتوزيع الصفحات والأسطر من مصحف المدينة (بيانات quran.ws، رخصة CC BY 4.0).</p>`;
}

/* ============ الهيكل والصلاحيات ============ */
function permsView(m){
  if(!can(m,"perms.manage"))return empty("هذه الصفحة لمدير البرنامج.");
  const roles=["admin","supervisor","teacher","assistant","examiner"];
  const RC=Object.fromEntries(roles.map(r=>[r,roleCfg(r)]));
  const people=r=>S.members.filter(x=>x.status==="active"&&(x.role===r||(r==="director"&&isOwnerM(x)&&x.role!=="director"))).filter((x,i,a)=>a.indexOf(x)===i);
  const det=x=>{if(["supervisor","assistant"].includes(x.role))return (x.circleIds||[]).map(id=>(get("circles",id)||{}).name).filter(Boolean).join("، ")||"لا حلقات مسندة";
    if(x.role==="teacher"){const cs=S.circles.filter(c=>c.teacherId===x.id);return `${cs.map(c=>c.name).join("، ")||"بدون حلقة"} · ${allStudents().filter(s=>s.teacherId===x.id).length} طالب`}return x.phone||""};
  const chip=x=>`<button class="pchip" data-act="editMember" data-id="${x.id}"><span class="avatar">${avIn(x)}</span><span class="pc-t"><b>${esc(x.name)}</b><small>${esc(det(x))}</small></span>${Object.keys(x.permOverrides||{}).length||x.scopeOverride?'<span class="pill p-acc">خاص</span>':""}</button>`;
  const levels=[["director","مدير البرنامج","كل الصلاحيات"],...roles.map(r=>[r,{admin:"المشرفون العامّون",supervisor:"مشرفو الحلقات",teacher:"المعلمون",assistant:"المعلمون المساعدون",examiner:"المختبِرون"}[r],SCOPE[RC[r].scope]])];
  const ovs=S.members.filter(x=>Object.keys(x.permOverrides||{}).length||x.scopeOverride||x.attScopeOverride);
  return `<div class="hero"><div><h1>الهيكل والصلاحيات</h1><div class="date">من يرى ماذا، ومن يعدّل ماذا</div></div><div class="row"><button class="btn pri" data-act="addMember">إضافة عضو</button></div></div>
  <div class="card"><div class="card-h"><h2>الهيكل التنظيمي</h2><span class="hint">اضغط على أي شخص لتعديل دوره أو حلقاته أو صلاحياته الخاصة</span></div>
  <div class="org">${levels.map(([r,l,sc])=>`<div class="org-lv"><div class="org-h"><b>${l}</b><span class="small muted">${people(r).length} · ${sc}</span></div><div class="org-row">${people(r).map(chip).join("")||'<span class="hint">لا أحد بعد</span>'}</div></div>`).join("")}
  <div class="org-lv"><div class="org-h"><b>الطلاب وأولياء الأمور</b></div><div class="org-row"><span class="pill p-pri">${S.circles.length} حلقة</span><span class="pill p-pri">${allStudents().length} طالب</span><span class="pill p-pri">${S.members.filter(x=>x.role==="parent"&&x.status==="active").length} ولي أمر</span></div></div></div></div>
  <div class="card"><div class="card-h"><h2>جدول الصلاحيات</h2><button class="btn sm danger" data-act="resetPerms">إعادة الافتراضي</button></div>
  <p class="hint" style="margin-bottom:10px">عدّل ما تريد ثم اضغط «حفظ التعديلات» أسفل الشاشة ليطبَّق على كل من يحمل الدور. مدير البرنامج يملك كل الصلاحيات دائماً.</p>
  <div class="tbl-wrap"><table class="pmx"><thead><tr><th>الصلاحية</th><th>مدير البرنامج</th>${roles.map(r=>`<th>${ROLE[r]}</th>`).join("")}</tr></thead><tbody>
  <tr class="scope-row"><td><b>نطاق البيانات</b><div class="small muted">الطلاب الذين يراهم ويعمل عليهم</div></td><td>كل الطلاب</td>${roles.map(r=>`<td><select data-change="pscope" data-r="${r}" id="ps-${r}">${Object.entries(SCOPE).map(([k,l])=>`<option value="${k}" ${RC[r].scope===k?"selected":""}>${l}</option>`).join("")}</select></td>`).join("")}</tr>
  <tr class="scope-row"><td><b>نطاق التحضير</b><div class="small muted">من يستطيع تحضيرهم وتسجيل متابعتهم</div></td><td>الجميع</td>${roles.map(r=>`<td><select data-change="pattscope" data-r="${r}" id="pa-${r}"><option value="data" ${RC[r].attScope!=="circle"?"selected":""}>كل من في نطاقه</option><option value="circle" ${RC[r].attScope==="circle"?"selected":""}>حلقته فقط</option></select></td>`).join("")}</tr>
  ${PERM_GROUPS.map(([g,ps])=>`<tr class="grp"><td colspan="${roles.length+2}">${g}</td></tr>${ps.map(([k,l])=>`<tr><td>${l}</td><td class="c"><span class="lock">✓</span></td>${roles.map(r=>`<td class="c"><input type="checkbox" data-change="perm" data-r="${r}" data-k="${k}" id="pm-${r}-${k.replace(".","_")}" ${RC[r].perms[k]?"checked":""} aria-label="${l} — ${ROLE[r]}"></td>`).join("")}</tr>`).join("")}`).join("")}
  <tr class="grp"><td colspan="${roles.length+2}">خاص بالمدير</td></tr><tr><td>إدارة الهيكل والصلاحيات</td><td class="c"><span class="lock">✓</span></td>${roles.map(()=>`<td class="c muted">—</td>`).join("")}</tr>
  </tbody></table></div>
  <p class="hint" style="margin-top:8px">«حلقاته المسندة»: الحلقات التي تحددها لمشرف الحلقات أو المعلم المساعد من بطاقة العضو. «طلابه وحلقاته فقط»: الطلاب المسندون إليه والحلقات التي هو معلمها.</p></div>
  <div class="card"><div class="card-h"><h2>صلاحيات خاصة بأشخاص</h2></div>${ovs.length?`<div class="list">${ovs.map(x=>`<div class="li"><div class="grow"><div class="t">${esc(x.name)} <span class="small muted">· ${ROLE[x.role]}</span></div><div class="chips" style="margin-top:4px">${x.scopeOverride?`<span class="pill p-info">النطاق: ${SCOPE[x.scopeOverride]}</span>`:""}${x.attScopeOverride?`<span class="pill p-info">التحضير: ${x.attScopeOverride==="circle"?"حلقته فقط":"كل نطاقه"}</span>`:""}${Object.entries(x.permOverrides||{}).map(([k,v])=>`<span class="pill ${v?"p-ok":"p-bad"}">${v?"سماح":"منع"}: ${(PERMS.find(p=>p[0]===k)||[,k])[1]}</span>`).join("")}</div></div><button class="btn sm" data-act="editMember" data-id="${x.id}">تعديل</button></div>`).join("")}</div>`:empty("لا استثناءات. من بطاقة أي عضو افتح «صلاحيات خاصة لهذا الشخص» لتمنحه صلاحية إضافية أو تمنعها عنه.")}</div>`;
}
function permsDoc(){const roles={};["admin","supervisor","teacher","assistant","examiner"].forEach(r=>{const c=roleCfg(r);roles[r]={scope:c.scope,attScope:c.attScope,perms:{...c.perms}}});return roles}

/* ============ التصدير: Excel و PDF ============ */
const LIBS={};
function lib(src,glob){return LIBS[src]||(LIBS[src]=new Promise((res,rej)=>{if(window[glob])return res(window[glob]);const sc=document.createElement("script");sc.src=src;sc.onload=()=>window[glob]?res(window[glob]):rej(new Error("lib"));sc.onerror=()=>{delete LIBS[src];rej(new Error("load"))};document.head.appendChild(sc)}))}
const XLSX_SRC="vendor/xlsx.full.min.js",JSPDF_SRC="vendor/jspdf.umd.min.js";
async function saveBlob(name,blob){
  if(DL){try{await DL.save({filename:name,data:blob});return}catch(e){if(e&&e.code==="declined")return;toast("تعذّر التنزيل ("+(e&&e.code||"")+")","err");return}}
  if(MODE==="demo"){const url=URL.createObjectURL(blob);openModal("الملف جاهز",`<p>في العرض التجريبي خارج المنصة لا يتوفر التنزيل المباشر.</p><p class="hint">${esc(name)} · ${Math.round(blob.size/1024)} ك.ب</p>`,"noop",{},"إغلاق");return url}
  toast("التنزيل غير متاح في هذا العرض","err");
}
const fname=t=>String(t).replace(/[\\/:*?"<>|]+/g,"").replace(/\s+/g,"-");
async function exportXLSX(name,sheets){
  toast("جاري تجهيز ملف Excel…");let X;try{X=await lib(XLSX_SRC,"XLSX")}catch(e){toast("تعذّر تحميل أداة Excel. تحقق من الاتصال.","err");return}
  const wb=X.utils.book_new();wb.Workbook={Views:[{RTL:true}]};
  sheets.forEach((sh,i)=>{const aoa=[[sh.title],[sh.sub||""],[],sh.head,...sh.rows];const ws=X.utils.aoa_to_sheet(aoa);
    ws["!cols"]=sh.head.map((h,c)=>({wch:Math.min(45,Math.max(8,...[h,...sh.rows.map(r=>r[c])].map(v=>String(v??"").length+2)))}));
    ws["!merges"]=[{s:{r:0,c:0},e:{r:0,c:Math.max(0,sh.head.length-1)}},{s:{r:1,c:0},e:{r:1,c:Math.max(0,sh.head.length-1)}}];
    X.utils.book_append_sheet(wb,ws,(sh.name||("ورقة"+(i+1))).replace(/[\\/?*[\]:]/g,"").slice(0,31))});
  const out=X.write(wb,{bookType:"xlsx",type:"array"});
  await saveBlob(fname(name)+".xlsx",new Blob([out],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
}
async function exportPDF(name,doc,opt){opt=opt||{};
  toast("جاري تجهيز ملف PDF…");let J;try{J=await lib(JSPDF_SRC,"jspdf")}catch(e){toast("تعذّر تحميل أداة PDF. تحقق من الاتصال.","err");return}
  try{await Promise.all([document.fonts.load('800 30px Tajawal'),document.fonts.load('500 20px Tajawal')])}catch(e){}
  const W=1754,H=1240,M=70,F="Tajawal, Tahoma, sans-serif";const pages=[];let cv,x,y;
  const logo=new Image();logo.src=logoMark();try{await logo.decode()}catch(e){}
  const fit=(t,w)=>{t=String(t??"");if(x.measureText(t).width<=w)return t;while(t.length>1&&x.measureText(t+"…").width>w)t=t.slice(0,-1);return t+"…"};
  const newPage=()=>{cv=document.createElement("canvas");cv.width=W;cv.height=H;x=cv.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,W,H);x.direction="rtl";
    try{x.drawImage(logo,W-M-64,38,64,64)}catch(e){}
    x.textAlign="right";x.fillStyle="#284a70";x.font=`800 34px ${F}`;x.fillText(doc.title,W-M-84,76);
    x.fillStyle="#5b6979";x.font=`500 20px ${F}`;x.fillText(doc.sub||"",W-M-84,106);
    x.textAlign="left";x.fillText(cfg().circleName+(brand().tagline?" · "+brand().tagline:""),M,76);
    const gw=(W-2*M)/3;[["#e3c45a",0],["#2b8ea8",1],["#284a70",2]].forEach(([c,i])=>{x.fillStyle=c;x.fillRect(M+i*gw,124,gw,4)});
    y=160;pages.push(cv)};
  const foot=()=>{x.direction="rtl";x.textAlign="center";x.fillStyle="#8a96a3";x.font=`500 17px ${F}`;x.fillText(`صفحة ${pages.length} · صُدِّر في ${fmtD(today(),{day:"numeric",month:"long",year:"numeric"})}`,W/2,H-34)};
  newPage();
  if(doc.summary&&doc.summary.length){const per=6,gap=14,bw=(W-2*M-(per-1)*gap)/per,bh=86;
    doc.summary.forEach(([l,v],i)=>{const r=Math.floor(i/per),c=i%per;const bx=W-M-(c+1)*bw-c*gap,by=y+r*(bh+gap);
      x.fillStyle="#f3f6f8";x.fillRect(bx,by,bw,bh);x.strokeStyle="#dce3e9";x.lineWidth=1.5;x.strokeRect(bx,by,bw,bh);
      x.textAlign="right";x.fillStyle="#284a70";x.font=`800 32px ${F}`;x.fillText(fit(v,bw-28),bx+bw-14,by+42);x.fillStyle="#5b6979";x.font=`500 18px ${F}`;x.fillText(fit(l,bw-28),bx+bw-14,by+72)});
    y+=Math.ceil(doc.summary.length/per)*(bh+gap)+16}
  (doc.tables||[]).forEach(tb=>{
    if(!tb.rows.length)return;
    if(tb.newPage&&y>170){foot();newPage()}
    if(tb.banner){x.textAlign="right";x.fillStyle="#284a70";x.font=`800 30px ${F}`;x.fillText(tb.banner,W-M,y+24);x.fillStyle="#5b6979";x.font=`500 19px ${F}`;x.fillText(tb.bannerSub||"",W-M,y+54);y+=78}
    x.font=`500 19px ${F}`;const n=tb.head.length;const want=tb.head.map((h,c)=>Math.min(tb.maxW?.[c]||420,Math.max(70,...[h,...tb.rows.slice(0,200).map(r=>r[c])].map(v=>{x.font=`500 19px ${F}`;return x.measureText(String(v??"")).width+26}))));
    const tot=want.reduce((a,b)=>a+b,0);const avail=W-2*M;const cw=want.map(w=>w*avail/tot);
    const rh=40;
    const head=()=>{x.fillStyle="#e2e9f2";x.fillRect(M,y,avail,rh);let cx=W-M;x.fillStyle="#284a70";x.font=`700 18px ${F}`;x.textAlign="right";tb.head.forEach((h,c)=>{x.fillText(fit(h,cw[c]-16),cx-8,y+26);cx-=cw[c]});y+=rh};
    if(y+90>H-M){foot();newPage()}
    if(tb.title){x.textAlign="right";x.fillStyle="#1c2a3b";x.font=`800 24px ${F}`;x.fillText(tb.title,W-M,y+20);y+=40}
    head();
    tb.rows.forEach((r,i)=>{if(y+rh>H-M-20){foot();newPage();head()}
      if(i%2){x.fillStyle="#f7f9fa";x.fillRect(M,y,avail,rh)}
      let cx=W-M;x.fillStyle="#1c2a3b";x.font=`500 18px ${F}`;x.textAlign="right";r.forEach((v,c)=>{x.fillText(fit(v,cw[c]-16),cx-8,y+26);cx-=cw[c]});
      x.strokeStyle="#e6ebef";x.lineWidth=1;x.beginPath();x.moveTo(M,y+rh);x.lineTo(W-M,y+rh);x.stroke();y+=rh});
    y+=26});
  foot();
  const pdf=new J.jsPDF({orientation:"landscape",unit:"pt",format:"a4"});const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
  pages.forEach((c,i)=>{if(i)pdf.addPage();pdf.addImage(c.toDataURL("image/jpeg",0.9),"JPEG",0,0,pw,ph)});
  const blob=pdf.output("blob");if(opt.share){const file=new File([blob],fname(name)+".pdf",{type:"application/pdf"});try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:doc.title,text:opt.text||doc.title});return}}catch(e){if(e&&e.name==="AbortError")return}}
  await saveBlob(fname(name)+".pdf",blob);
}
function studentsReportData(m){
  const st=scoped(m);const[f,t]=curRange();
  const rows=st.map(s=>{const x=stats(s.id,...(ui.pm==="all"?curRange(s.id):[f,t]));const E=examsOf(s.id,f,t);return{s,x,ex:E.length?Math.round(E.reduce((a,e)=>a+n0(e.score),0)/E.length):""}});
  const head=["الطالب","المسار","الحلقة","المعلم","نسبة الحضور %","حاضر","متأخر","غائب","مستأذن","حفظ جديد (وجه)","مراجعة (وجه)","تلاوة (وجه)","تنبيهات","تلقين","متوسط التقدير","مهام منجزة","إجمالي المهام","جلسات تسميع","متوسط الاختبارات","النقاط","إجمالي المحفوظ/المقروء"];
  const full=rows.map(({s,x,ex})=>[s.name,TRACK[s.track],(get("circles",s.circleId)||{}).name||"",nameOf(s.teacherId),x.rate??"",x.att.present,x.att.late,x.att.absent,x.att.excused,x.newPages,x.revPages,x.tPages,x.errT,x.errL,x.avg?+x.avg.toFixed(2):"",x.done,x.tasks,x.sess,ex,x.points,totalPages(s)]);
  const ph=["الطالب","الحلقة","الحضور","غياب","حفظ","مراجعة","تلاوة","تنبيه/تلقين","التقدير","المهام","الاختبار","النقاط"];
  const pr=rows.map(({s,x,ex})=>[s.name,(get("circles",s.circleId)||{}).name||"—",x.rate==null?"—":x.rate+"%",x.att.absent,x.newPages,x.revPages,x.tPages,`${x.errT}/${x.errL}`,x.avg?x.avg.toFixed(1)+" "+gradeTxt(x.avg):"—",`${x.done}/${x.tasks}`,ex===""?"—":ex,x.points]);
  const rr=rows.filter(r=>r.x.rate!=null);
  const summary=[["طالب",rows.length],["متوسط الحضور",rr.length?Math.round(rr.reduce((a,b)=>a+b.x.rate,0)/rr.length)+"%":"—"],["أوجه حفظ جديد",rows.reduce((a,r)=>a+r.x.newPages,0)],["أوجه مراجعة",rows.reduce((a,r)=>a+r.x.revPages,0)],["أوجه تلاوة",rows.reduce((a,r)=>a+r.x.tPages,0)],["مهام منجزة",`${rows.reduce((a,r)=>a+r.x.done,0)}/${rows.reduce((a,r)=>a+r.x.tasks,0)}`]];
  const scopeName=ui.circle!=="all"&&get("circles",ui.circle)?" — "+get("circles",ui.circle).name:"";
  return{title:"تقرير الطلاب"+scopeName,sub:periodLabel(),head,full,ph,pr,summary,f,t};
}
function studentReportData(sid){
  const s=get("members",sid);const[f,t]=curRange(sid);const x=stats(sid,f,t);const isT=s.track==="tilawa";const m=me();const staff=isStaff(m);const c=cfg();
  const showG=staff||c.studentSeeGrades;const who=staff?"staff":m.role==="parent"?"parent":"student";
  const note=l=>who==="staff"?[nS(l)&&"للطالب: "+nS(l),nP(l)&&"لولي الأمر: "+nP(l),can(m,"notes.private")&&l.noteStaff&&"داخلية: "+l.noteStaff].filter(Boolean).join(" | "):who==="parent"?nP(l):nS(l);
  const amt=l=>amountTxt(l).replace(/<[^>]+>/g,"").replace(/&[a-z#0-9]+;/g,"");
  const head=["التاريخ","الحضور","المقدار",...(showG?(isT?["تنبيه","تلقين","التقدير"]:["تقدير الحفظ","تقدير المراجعة"]):[]),"أحكام التجويد","الملاحظات"];
  const rows=x.logs.slice().reverse().map(l=>[l.date,ATT[l.attendance]||"",amt(l),...(showG?(isT?[EC(l).t,EC(l).l,gradeTxt(l.tGrade)]:[gradeTxt(l.newGrade),gradeTxt(l.revGrade)]):[]),(l.tajweed||[]).join("، "),[l.tajweedNote,note(l)].filter(Boolean).join(" — ")]);
  const E=examsOf(sid,f,t);
  const eh=["التاريخ","المقرر","الدرجة","التقدير","تنبيهات","تلقين","ملاحظات"];const er=E.map(e=>[e.date,e.scope||"",n0(e.score),examGrade(e.score)[0],n0(e.tanbih),n0(e.talqin),e.notes||""]);
  const summary=[["نسبة الحضور",x.rate==null?"—":x.rate+"%"],["حاضر/متأخر/غائب/مستأذن",`${x.att.present}/${x.att.late}/${x.att.absent}/${x.att.excused}`],...(isT?[["أوجه التلاوة",x.tPages],["تنبيه/تلقين",`${x.errT}/${x.errL}`]]:[["حفظ جديد (وجه)",x.newPages],["مراجعة (وجه)",x.revPages]]),...(showG?[["متوسط التقدير",x.avg?x.avg.toFixed(1)+" "+gradeTxt(x.avg):"—"]]:[]),["المهام المنجزة",`${x.done}/${x.tasks}`],["جلسات التسميع",x.sess],["إجمالي "+(isT?"المقروء":"المحفوظ"),totalPages(s)+" وجه"],...(E.length?[["متوسط الاختبارات",Math.round(E.reduce((a,e)=>a+n0(e.score),0)/E.length)]]:[]),...(c.showPoints?[["النقاط",x.points]]:[])];
  return{s,title:"تقرير الطالب: "+s.name,sub:`${TRACK[s.track]} · المعلم: ${nameOf(s.teacherId)} · ${periodLabel([f,t])}`,head,rows,eh,er,summary};
}
function programReportData(pid){
  const p=get("programs",pid);const st=programStudents(p);const L=p.lessons||[];
  const head=["الطالب",...L.map((l,i)=>`${i+1}. ${l.title}`),"المنجز","النسبة %"];
  const rows=st.map(s=>{const d=progOf(s.id,p.id);const n=L.filter(l=>d.includes(l.id)).length;return[s.name,...L.map(l=>d.includes(l.id)?"✓":"—"),`${n}/${L.length}`,L.length?Math.round(n/L.length*100):0]});
  return{title:"تقرير برنامج: "+p.title,sub:`${PKIND[p.kind]||""} · ${L.length} درس · ${st.length} طالب`,head,rows};
}

/* ============ التخصيص ============ */
const uiCfg=()=>get("config","ui")||{};
const DEF_BRAND={tagline:"أحد برامج مَعين",verse:"«خيرُكم مَن تعلَّم القرآنَ وعلَّمه»",primary:"",accent:"",bg:"",surface:"",header:"",fontBody:"",fontHead:"",fontScale:1,hideLogo:false};
const FONT_HOST="self";
const FONTS=[["SF Arabic","خط آبل (SF)","خط الآيفون — مثل تطبيقات آبل"],["Tajawal","تجوال","عصري وواضح"],["Cairo","القاهرة","عريض ومقروء"],["Almarai","المراعي","بسيط وهادئ"],["IBM Plex Sans Arabic","IBM Plex عربي","رسمي ومتوازن"],["Readex Pro","ريدكس","حديث ودائري"],["Noto Kufi Arabic","نوتو كوفي","كوفي هندسي"],["Reem Kufi","ريم كوفي","كوفي زخرفي للعناوين"],["Noto Naskh Arabic","نوتو نسخ","نسخ تقليدي"],["Amiri","أميري","نسخ كلاسيكي"]];
const SF_STACK=`"SF Arabic","SF Pro Text",-apple-system,BlinkMacSystemFont,system-ui,"Segoe UI","Noto Sans Arabic","Tajawal",Tahoma,sans-serif`;
const FONT_STACK=f=>f==="SF Arabic"?SF_STACK:`"${f}","Tajawal",Tahoma,"Segoe UI",sans-serif`;
const lum=h=>{const n=parseInt(h.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255;const L=c=>c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4);return .2126*L(r)+.7152*L(g)+.0722*L(b)};
const brand=()=>{const b={...DEF_BRAND,...(uiCfg().brand||{})};if(!b.fontV&&(!b.fontBody||b.fontBody==="Tajawal"))b.fontBody="SF Arabic";return b};
function saveUi(patch){return stageConfig("ui",{...uiCfg(),...patch})}
let TDEF=null;
const TERM_DICTS=()=>[["ROLE","الأدوار",ROLE,null],["TRACK","المسارات",TRACK,null],["CTRACK","مسارات الحلقات",CTRACK,null],["ATT","حالات الحضور",ATT,null],["GR","التقديرات",GR,null],["KIND","أنواع المهام",KIND,null],["PKIND","أنواع البرامج المصاحبة",PKIND,null],["JST","حالات خريطة الحفظ",JST,0],["SESS_LBL","حالات المواعيد",SESS_LBL,0],["TATT","حالات حضور المعلمين",TATT,1]];
function applyTerms(){
  const D=TERM_DICTS();if(!TDEF){TDEF={};D.forEach(([n,,o])=>TDEF[n]=JSON.parse(JSON.stringify(o)));TDEF.TAJ=[...TAJWEED]}
  const T=uiCfg().terms||{};
  D.forEach(([n,,o,idx])=>{Object.keys(TDEF[n]).forEach(k=>{const dv=TDEF[n][k];const ov=(T[n]||{})[k];if(idx==null)o[k]=ov||dv;else{o[k]=[...dv];if(ov)o[k][idx]=ov}})});
  const L=uiCfg().lists||{};const tj=L.tajweed&&L.tajweed.length?L.tajweed:TDEF.TAJ;TAJWEED.splice(0,TAJWEED.length,...tj);
}
const HEX=/^#[0-9a-f]{6}$/i;
const THEME_KEY="halaqa-theme";
function getThemeMode(){try{return localStorage.getItem(THEME_KEY)||"system"}catch(e){return"system"}}
const isDark=()=>{const t=getThemeMode();if(t==="dark")return true;if(t==="light")return false;const a=document.documentElement.getAttribute("data-theme");if(a)return a==="dark";return !!(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)};
function applyThemeMode(){const t=getThemeMode(),r=document.documentElement;if(t==="system"){if(r.dataset.userTheme){r.removeAttribute("data-theme");delete r.dataset.userTheme}}else{r.setAttribute("data-theme",t);r.dataset.userTheme="1"}}
function setThemeMode(t){try{if(t==="system")localStorage.removeItem(THEME_KEY);else localStorage.setItem(THEME_KEY,t)}catch(e){}applyThemeMode();render()}
try{applyThemeMode();window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>render())}catch(e){}
const COLOR_PRESETS=[["maeen","ألوان مَعين","#24406f","#8f6200"],["green","أخضر المصحف","#1f6b52","#b07d2a"],["teal","تركوازي هادئ","#17707d","#b8862e"],["burgundy","عنابي","#7a2e3b","#b8892f"],["brown","بني وذهبي","#6b4a2b","#b8902f"],["indigo","نيلي","#33407a","#b0862c"]];
const TOKENS=[["primary","اللون الأساسي","الأزرار والعناوين والقائمة"],["accent","لون التمييز","الذهبي والزخارف والتنبيهات اللطيفة"],["bg","خلفية الواجهة","لون الصفحة كلها"],["surface","البطاقات","خلفية البطاقات والنوافذ"],["surface2","الخلفيات الثانوية","مربعات الأرقام وخلفيات الجداول"],["header","الشريط العلوي",""],["ink","النصوص",""],["muted","النصوص الثانوية","التواريخ والتوضيحات"],["line","الحدود",""],["ok","حاضر / نجاح",""],["warn","متأخر / تنبيه",""],["bad","غائب / خطأ",""],["info","مستأذن / معلومة",""]];
const TOKEN_DEF={light:{primary:"#24406f",accent:"#8f6200",bg:"#eef3f8",surface:"#ffffff",surface2:"#e9f0f7",header:"#ffffff",ink:"#1f3559",muted:"#5e6f8c",line:"#dde6f0",ok:"#21875a",warn:"#a86e00",bad:"#c2453b",info:"#1b93b4"},dark:{primary:"#8fb8f2",accent:"#f5c547",bg:"#0d182b",surface:"#14233b",surface2:"#1a2c48",header:"#14233b",ink:"#e8eef7",muted:"#9db0cb",line:"#26395a",ok:"#5cc08d",warn:"#e2ac4f",bad:"#e57d72",info:"#5cc2db"}};
const okHex=v=>HEX.test(v||"")?v:"";
function lightTokens(b){const legacy={primary:b.primary,accent:b.accent,bg:b.bg,surface:b.surface,header:b.header};const o={};Object.entries({...legacy,...(b.light||{})}).forEach(([k,v])=>{if(okHex(v))o[k]=v});return o}
function darkTokens(b){const o={};Object.entries(b.dark||{}).forEach(([k,v])=>{if(okHex(v))o[k]=v});return o}
function tokenVars(t,dark){
  let v="";const B=t.bg||TOKEN_DEF[dark?"dark":"light"].bg;const set=(k,x)=>{v+=`--${k}:${x};`};
  if(t.primary){set("primary",t.primary);set("primary-soft",`color-mix(in srgb,${t.primary} ${dark?28:12}%,${B})`);set("primary-ink",lum(t.primary)>.42?"#0c1420":"#ffffff");set("teal",t.primary)}
  if(t.accent){set("accent",t.accent);set("gold",t.accent);set("accent-soft",`color-mix(in srgb,${t.accent} ${dark?22:14}%,${B})`)}
  if(t.bg)set("bg",t.bg);if(t.surface)set("surface",t.surface);if(t.surface2)set("surface-2",t.surface2);if(t.ink)set("ink",t.ink);if(t.muted)set("muted",t.muted);if(t.line)set("line",t.line);
  ["ok","warn","bad","info"].forEach(k=>{if(t[k]){set(k,t[k]);set(k+"-soft",`color-mix(in srgb,${t[k]} ${dark?22:14}%,${B})`)}});
  if(t.header){const d=lum(t.header)<.35;set("top",t.header);set("top-ink",d?"#ffffff":(t.ink||"#1c2a3b"));set("top-muted",d?"rgba(255,255,255,.75)":(t.muted||"#5b6979"));set("top-on",d?"rgba(255,255,255,.18)":"var(--primary)");set("top-on-ink",d?"#ffffff":"var(--primary-ink)")}
  return v;
}
function autoDarkVars(L){let v="";const p=L.primary,a=L.accent;
  if(p)v+=`--primary:color-mix(in srgb,${p} 62%,white);--primary-ink:#0c1420;--primary-soft:color-mix(in srgb,${p} 30%,#0f151d);`;
  if(a)v+=`--accent:color-mix(in srgb,${a} 75%,white);--accent-soft:color-mix(in srgb,${a} 22%,#0f151d);--gold:color-mix(in srgb,${a} 75%,white);`;
  if(L.bg)v+=`--bg:color-mix(in srgb,${L.bg} 10%,#0b1016);--surface-2:color-mix(in srgb,${L.bg} 12%,#18212b);`;
  if(L.surface)v+=`--surface:color-mix(in srgb,${L.surface} 10%,#151d27);`;
  if(L.header)v+=`--top:color-mix(in srgb,${L.header} 45%,#0b1016);--top-ink:#ffffff;--top-muted:rgba(255,255,255,.72);--top-on:rgba(255,255,255,.16);--top-on-ink:#ffffff;`;
  return v}
const cssName=n=>String(n||"").replace(/["'\;{}<>]/g,"").trim().slice(0,60);
function allFonts(){const b=brand();return [...FONTS,...(b.customFonts||[]).filter(f=>f&&f.name).map(f=>[cssName(f.name),cssName(f.name),f.google?"من Google Fonts":"خط مرفوع",f])]}
function applyTheme(){
  const b=brand();const L=lightTokens(b),D=darkTokens(b);const auto=b.darkAuto!==false;
  const lv=tokenVars(L,false);const dv=auto?autoDarkVars(L)+tokenVars(D,true):tokenVars(D,true);
  const known=allFonts().map(f=>f[0]);const fb=b.fontBody&&known.includes(b.fontBody)?b.fontBody:"",fh=b.fontHead&&known.includes(b.fontHead)?b.fontHead:"";
  const sc=Math.min(1.3,Math.max(.85,Number(b.fontScale)||1));
  const faces=(b.customFonts||[]).filter(f=>f&&f.url&&/^(https:\/\/|\/|blob:)/.test(f.url)).map(f=>`@font-face{font-family:"${cssName(f.name)}";src:url("${String(f.url).replace(/["\\]/g,"")}");font-weight:100 900;font-display:swap}`).join("");
  const fv=(fb?`--f-body:${FONT_STACK(fb)};`:"")+(fh||fb?`--f-display:${FONT_STACK(fh||fb)};`:"");
  const css=faces+(lv||dv?`:root{${lv}}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${dv}}}:root[data-theme="light"]{${lv}}:root[data-theme="dark"]{${dv}}`:"")+(fv?`:root{${fv}}`:"")+(sc!==1?`html{font-size:${sc*100}%}body{font-size:${(16*sc).toFixed(1)}px}`:"")+designCSS(design())+icCSS(design())+freeCSS(design().free);try{document.documentElement.dataset.hero=design().hero||"poster";document.body.dataset.pv=pvKey();document.body.classList.toggle("free-edit",!!ui.freeEdit);document.body.classList.toggle("sim-mob",editing()&&edDev()==="m"&&innerWidth>=760);document.body.classList.toggle("sim-desk",editing()&&edDev()==="d"&&innerWidth<760);setTimeout(()=>{feApplyText();try{decorIcons();vivid()}catch(e){}},0)}catch(e){}
  let el=document.getElementById("ctheme");if(!el){el=document.createElement("style");el.id="ctheme";document.head.appendChild(el)}if(el.textContent!==css)el.textContent=css;
  const gnames=new Set((b.customFonts||[]).filter(f=>f&&f.google).map(f=>cssName(f.name)));
  const need=[...new Set([fb,fh].filter(f=>f&&f!=="Tajawal"&&f!=="SF Arabic"&&(FONT_HOST==="google"&&FONTS.some(x=>x[0]===f)||gnames.has(f))))];
  const href=need.length?"https://fonts.googleapis.com/css2?"+need.map(f=>"family="+encodeURIComponent(f).replace(/%20/g,"+")+(gnames.has(f)?"":":wght@400;700")).join("&")+"&display=swap":"";
  let l=document.getElementById("gfont");if(href){if(!l){l=document.createElement("link");l.id="gfont";l.rel="stylesheet";document.head.appendChild(l)}if(l.getAttribute("href")!==href)l.setAttribute("href",href)}else if(l)l.remove();
}
function colorsCardHTML(b){
  const mode=ui.cmodeTab||(isDark()?"dark":"light");const auto=b.darkAuto!==false;const T=mode==="dark"?darkTokens(b):lightTokens(b);const D=TOKEN_DEF[mode];
  const rows=TOKENS.map(([k,l,h])=>`<label class="crow"><span class="swatch" style="background:${T[k]||D[k]}"></span><b class="grow">${l}${h?`<br><small class="muted" style="font-weight:400">${h}</small>`:""}${T[k]?"":` <span class="hint">(افتراضي)</span>`}</b>${T[k]?`<button type="button" class="btn ghost sm" data-act="tokClear" data-m="${mode}" data-k="${k}">افتراضي</button>`:""}<input type="color" id="tk-${mode}-${k}" value="${T[k]||D[k]}" data-change="tokSet" data-m="${mode}" data-k="${k}"></label>`).join("");
  return `<div class="card" style="grid-column:1/-1"><div class="card-h"><h2>الألوان</h2><button class="btn sm" data-act="colorsReset">ألوان مَعين الأصلية</button></div>
  <div class="stack"><div class="presets">${COLOR_PRESETS.map(([k,l,p,a])=>`<button class="preset" data-act="colorPreset" data-v="${k}"><span class="sw" style="background:${p}"></span><span class="sw" style="background:${a}"></span>${l}</button>`).join("")}</div>
  <div class="subtabs"><button data-act="cmodeTab" data-v="light" class="${mode==="light"?"on":""}">${ICON.sun} ألوان الوضع الفاتح</button><button data-act="cmodeTab" data-v="dark" class="${mode==="dark"?"on":""}">${ICON.moon} ألوان الوضع الليلي</button></div>
  <p class="hint">عند اختيار تبويب يتحول عرضك إلى ذلك الوضع لتشاهد التعديل مباشرة.</p>
  ${mode==="dark"?`<label class="switch" style="border:0;padding:0"><span><b>اشتقاق ألوان الليلي تلقائياً من الفاتح</b><br><span class="hint">أطفئه لتختار كل لون في الوضع الليلي بنفسك</span></span><input type="checkbox" id="b-dauto" data-change="darkAuto" ${auto?"checked":""}></label>`:""}
  ${mode==="dark"&&auto?`<p class="hint">ألوان الليلي الآن مشتقة من ألوان الفاتح. ما تغيّره هنا يُطبَّق فوق الاشتقاق.</p>`:""}
  <div class="tok-grid">${rows}</div></div></div>`;
}
function fontsCardHTML(b){
  const F=allFonts();const cf=b.customFonts||[];
  return `<div class="card" style="grid-column:1/-1"><div class="card-h"><h2>الخطوط</h2><button class="btn sm" data-act="fontsReset">الخط الافتراضي</button></div>
    <div class="fg">${fld("خط النصوص",`<select id="b-fbody" data-change="brandFont" data-k="fontBody">${F.map(([f,l,h])=>`<option value="${esc(f)}" ${(b.fontBody||"Tajawal")===f?"selected":""}>${esc(l)} — ${esc(h)}</option>`).join("")}</select>`)}${fld("خط العناوين",`<select id="b-fhead" data-change="brandFont" data-k="fontHead"><option value="">نفس خط النصوص</option>${F.map(([f,l,h])=>`<option value="${esc(f)}" ${b.fontHead===f?"selected":""}>${esc(l)} — ${esc(h)}</option>`).join("")}</select>`)}</div>
    <div class="row" style="gap:10px"><span class="small muted">حجم الخط</span><div class="seg modeseg">${[[0.9,"صغير"],[1,"عادي"],[1.1,"كبير"],[1.2,"كبير جداً"]].map(([v,l])=>`<button data-act="fontScale" data-v="${v}" class="${Math.abs((Number(b.fontScale)||1)-v)<.01?"on":""}">${l}</button>`).join("")}</div></div>
    <div class="font-prev"><h3>منصة حلقات القرآن الكريم</h3><p>بسم الله نبدأ: حضر الطالب اليوم، وسمّع وجهين من سورة الملك بتقدير ممتاز، ٠١٢٣ 0123.</p></div>
    <div class="font-grid">${F.map(([f,l,h])=>`<button class="font-card ${(b.fontBody||"Tajawal")===f?"on":""}" data-act="pickFont" data-v="${esc(f)}" style="font-family:${FONT_STACK(f).replace(/"/g,"&quot;")}"><b>${esc(l)}</b><span>حلقات القرآن الكريم</span><small>${esc(h)}</small></button>`).join("")}</div>
    <fieldset><legend>إضافة خط خارجي</legend>
     <div class="fg">${fld("اسم الخط",`<input id="cf-name" placeholder="مثال: خطي الخاص أو Lalezar" maxlength="60">`,"للخط من Google اكتب اسمه كما هو في fonts.google.com")}</div>
     <div class="row" style="gap:8px">${ASSETS||MODE==="demo"?`<label class="btn sm pri">رفع ملف خط (woff2, woff, ttf, otf)<input type="file" id="cf-file" accept=".woff2,.woff,.ttf,.otf,font/*" data-change="fontUpload" hidden></label>`:`<span class="hint">رفع الملفات يحتاج صلاحية رفع على المنصة.</span>`}<button type="button" class="btn sm" data-act="fontGoogle">إضافة من Google Fonts</button></div>
     ${cf.length?`<div class="list">${cf.map((f,i)=>`<div class="li"><span class="grow" style="font-family:${FONT_STACK(cssName(f.name)).replace(/"/g,"&quot;")}"><b>${esc(f.name)}</b> <span class="small muted">· ${f.google?"Google Fonts":"ملف مرفوع"}</span> — حلقات القرآن الكريم</span><button class="btn ghost sm danger" data-act="fontDel" data-i="${i}">حذف</button></div>`).join("")}</div>`:""}
    </fieldset>
    <p class="hint">اضغط أي خط لتجربته على المنصة كلها، ثم «حفظ التعديلات».</p></div>`;
}

function applyReplace(root){
  const L=(uiCfg().replace||[]).filter(r=>r&&r[0]);if(!L.length||!root)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const todo=[];
  while((n=w.nextNode())){if(!n.nodeValue.trim())continue;const pe=n.parentElement;if(!pe||pe.closest(".mushaf,[data-noreplace],textarea,script,style"))continue;todo.push(n)}
  todo.forEach(n=>{let t=n.nodeValue;const o=t;L.forEach(([a,b])=>{if(t.includes(a))t=t.split(a).join(b||"")});if(t!==o)n.nodeValue=t});
}
function navItems(m,base,noP){
  const rc=((uiCfg().nav||{})[m.role])||[];
  let items=base.map(([k,l])=>{const o=rc.find(x=>x.k===k)||{};return{k,dl:l,l:o.l||l,h:!!o.h,i:rc.findIndex(x=>x.k===k)}});
  items.sort((a,b)=>(a.i<0?999:a.i)-(b.i<0?999:b.i));
  if(!noP&&(m.navPref||[]).length){const P=m.navPref;items.forEach(it=>{const j=P.findIndex(x=>x.k===it.k);it.pi=j<0?999:j;it.ph=j<0?false:!!P[j].h});items.sort((a,b)=>a.pi-b.pi)}
  return items;
}
function orderNav(m,base){const items=navItems(m,base,false);const vis=items.filter(it=>!it.h&&!it.ph);return (vis.length?vis:items.slice(0,1)).map(it=>[it.k,it.l])}
const fakeM=r=>({id:"_preview",role:r,status:"active",circleIds:[],childIds:[]});
const roleNavItems=r=>{const f=fakeM(r);return navItems(f,baseNav(f),true)};
function saveNav(r,items){const nav={...(uiCfg().nav||{})};nav[r]=items.map(x=>({k:x.k,...(x.l!==x.dl?{l:x.l}:{}),...(x.h?{h:true}:{})}));saveUi({nav})}
const HOME_BLOCKS={staff:[["hero","الترحيب والأزرار السريعة",1],["stats","الأرقام السريعة",1],["zadpray","مواقيت الصلاة",1],["divs","المراحل والأقسام",1],["board","الأوائل",1],["challenge","التحديات",1],["pending","بانتظار إجراء منك",1],["alerts","التنبيهات",1],["recits","التسميع الصوتي بانتظار التقييم",1],["sessions","مواعيد اليوم",0],["students","حال الطلاب اليوم",0]],
  parent:[["kids","تبديل الأبناء",1],["hero","بطاقة الابن",1],["zadpray","مواقيت الصلاة",1],["strip","ترتيب الابن",1],["prog","البرامج المصاحبة",1],["week","أسبوع الابن",1],["msg","ملاحظة المعلم",1],["goal","الهدف",1],["marks","ملاحظات التسميع",1],["next","موعد التسميع القادم",1],["tasks","مهام اليوم",1],["badges","الأوسمة",1],["certs","الشهادات",1],["report","التقرير التفصيلي",1]],
  student:[["hero","بطاقة اليوم",1],["selfwird","تسجيل وردي اليوم",1],["zadpray","مواقيت الصلاة",1],["stats","الأرقام السريعة",1],["board","الأوائل ومركزي",1],["goal","هدفي",1],["msg","رسالة المعلم",1],["prog","لقاءات البرامج ورسائلها",1],["tasks","مهام اليوم",1],["challenge","تحدي الحلقة",1],["next","موعد التسميع القادم",1],["circle","بطاقة الحلقة",1],["side","آخر متابعة والأيام القادمة",1],["badges","الأوسمة",1],["certs","الشهادات",1]]};
function homeOrder(g){const U=(editing()&&edDev()==="all"?null:((uiCfg()[devKey()]||{})[g]))||((uiCfg().home||{})[g])||[];const D=[...HOME_BLOCKS[g],...homeCustom(g).map(c=>["cx:"+c.id,c.t||"مربع مخصص",0])];const at=k=>U.findIndex(x=>x.k===k);const items=D.map(([k,l,full,hid],di)=>{const o=U.find(x=>x.k===k)||{};let i=at(k);if(i<0&&U.length){let j=di-1;while(j>=0&&at(D[j][0])<0)j--;i=j>=0?at(D[j][0])+0.5:-0.5}return{k,l,full:o.w?(o.w==="full"||Number(o.w)===12):full,w:o.w,hh:o.hh,sz:o.sz,st:!!o.st,h:U.some(x=>x.k===k)?!!o.h:!!hid,i}});items.sort((a,b)=>a.i-b.i);return items}
function saveHome(g,items){const K=layScope(g)==="dev"?devKey():"home";const home={...(uiCfg()[K]||{})};home[g]=items.map(x=>({k:x.k,...(x.h?{h:true}:{}),...(x.w?{w:x.w}:{}),...(x.hh?{hh:x.hh}:{}),...(x.sz?{sz:x.sz}:{}),...(x.st?{st:true}:{})}));if(K==="home"){const prev=((uiCfg().home||{})[g])||homeOrder(g).map(x=>({k:x.k,...(x.h?{h:true}:{}),...(x.w?{w:x.w}:{}),...(x.hh?{hh:x.hh}:{}),...(x.sz?{sz:x.sz}:{}),...(x.st?{st:true}:{})}));const P={};prev.forEach(x=>P[x.k]=x);const nl=home[g];const ord=nl.map(x=>x.k);const orderCh=prev.map(x=>x.k).join()!==ord.join();const extra={};
  ["homeM","homeD"].forEach(k2=>{const o=uiCfg()[k2];if(!(o&&o[g]))return;let L=o[g].map(x=>({...x}));nl.forEach(n=>{const p=P[n.k]||{};const t=L.find(x=>x.k===n.k);if(!t){L.push({...n});return}["w","hh","h","sz","st"].forEach(f=>{if(JSON.stringify(n[f])!==JSON.stringify(p[f])){if(n[f]==null)delete t[f];else t[f]=n[f]}})});if(orderCh){L.sort((a,b)=>{const i=ord.indexOf(a.k),j=ord.indexOf(b.k);return (i<0?999:i)-(j<0?999:j)})}extra[k2]={...o,[g]:L}});
  saveUi({home,...extra})}else saveUi({[K]:home})}
const GRIP=`<svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true"><g fill="currentColor"><circle cx="4" cy="4" r="1.7"/><circle cx="10" cy="4" r="1.7"/><circle cx="4" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="4" cy="16" r="1.7"/><circle cx="10" cy="16" r="1.7"/></g></svg>`;
let DRAG=null,PENDING=false;
function commitSort(list,keys,focusKey){
  const t=list.dataset.sort;
  if(t==="nav"){const r=list.dataset.r;const items=roleNavItems(r);saveNav(r,keys.map(k=>items.find(x=>x.k===k)).filter(Boolean))}
  else if(t==="home"){const g=list.dataset.g;const items=homeOrder(g);saveHome(g,keys.map(k=>items.find(x=>x.k===k)).filter(Boolean))}
  else if(t==="mynav"){myNavModal(keys.map(k=>modalCtx.items.find(x=>x.k===k)).filter(Boolean))}
  if(focusKey)setTimeout(()=>{const g=document.querySelector(`.clist[data-sort="${t}"] .crow[data-key="${focusKey}"] .grip`);if(g)g.focus()},30);
}
document.addEventListener("pointerdown",e=>{const g=e.target.closest(".grip");if(!g)return;const row=g.closest(".crow"),list=row&&row.parentElement;if(!list||!list.dataset.sort)return;
  e.preventDefault();const b=row.getBoundingClientRect();DRAG={row,list,id:e.pointerId,order:[...list.querySelectorAll(":scope > .crow")].map(r=>r.dataset.key),dy:e.clientY-b.top};row.classList.add("dragging");list.classList.add("sorting");try{g.setPointerCapture(e.pointerId)}catch(_){}});
document.addEventListener("pointermove",e=>{if(!DRAG||e.pointerId!==DRAG.id)return;const{row,list}=DRAG;
  const rows=[...list.querySelectorAll(":scope > .crow")].filter(r=>r!==row);let before=null;
  for(const r of rows){const b=r.getBoundingClientRect();if(e.clientY<b.top+b.height/2){before=r;break}}
  if(before){if(row.nextElementSibling!==before)list.insertBefore(row,before)}else if(list.lastElementChild!==row)list.appendChild(row);
  const sc=row.closest(".dlg")||window;const dy=e.clientY<70?-14:e.clientY>innerHeight-70?14:0;if(dy)sc.scrollBy(0,dy)});
function endDrag(e){if(!DRAG||(e&&e.pointerId!==DRAG.id))return;const{row,list,order}=DRAG;row.classList.remove("dragging");list.classList.remove("sorting");DRAG=null;
  const keys=[...list.querySelectorAll(":scope > .crow")].map(r=>r.dataset.key);if(keys.join()!==order.join())commitSort(list,keys);else if(PENDING){PENDING=false;render()}}
document.addEventListener("pointerup",endDrag);document.addEventListener("pointercancel",endDrag);
document.addEventListener("keydown",e=>{const g=e.target.closest&&e.target.closest(".grip");if(!g||(e.key!=="ArrowUp"&&e.key!=="ArrowDown"))return;e.preventDefault();e.stopPropagation();
  const row=g.closest(".crow"),list=row.parentElement;const keys=[...list.querySelectorAll(":scope > .crow")].map(r=>r.dataset.key);const i=keys.indexOf(row.dataset.key),j=i+(e.key==="ArrowUp"?-1:1);if(j<0||j>=keys.length)return;[keys[i],keys[j]]=[keys[j],keys[i]];commitSort(list,keys,row.dataset.key)},true);
const moveBtns=(act,attrs,i,len)=>`<button class="btn ghost sm" data-act="${act}" ${attrs} data-n="-1" ${i===0?"disabled":""} aria-label="لأعلى">↑</button><button class="btn ghost sm" data-act="${act}" ${attrs} data-n="1" ${i===len-1?"disabled":""} aria-label="لأسفل">↓</button>`;
/* ============ الأشكال والقوالب: تخصيص الحواف والأحجام والمسافات والزخارف ============ */
const DESIGN_DEF={icStyle:"soft",icColor:"",icSize:42,icRad:30,icStroke:2,icHead:true,icStat:true,tpl:"maeen",rCard:22,rBtn:12,rInput:10,pill:"round",shadow:"soft",border:1,density:"normal",width:1120,appWidth:640,statMin:130,statNum:1.45,cols:"auto",statBar:true,hero:"poster",mosque:true,moon:true,heroPad:22,top:"white",stripe:true,bg:"stars",bgOp:6,marker:"square",btn:"gradient",tab:"gradient",fs:16,css:""};
const DESIGN_TPLS=[
  ["maeen","بوستر مَعين","ترحيب أزرق بهلال ومسجد، حواف ناعمة، نقش نجوم",{}],
  ["classic","كلاسيكي هادئ","ترحيب فاتح بنقش خفيف، حواف متوسطة",{rCard:14,rBtn:9,rInput:8,hero:"simple",bg:"none",marker:"diamond",btn:"flat",tab:"soft"}],
  ["round","مستدير ناعم","حواف كبيرة، ظلال أوضح، أزرار دائرية",{rCard:30,rBtn:999,rInput:16,shadow:"medium",hero:"color",moon:false,mosque:false,bg:"dots",density:"roomy"}],
  ["sharp","حاد ومرتّب","زوايا قليلة، حدود بلا ظلال، مضغوط",{rCard:6,rBtn:6,rInput:4,pill:"square",shadow:"none",border:1,hero:"simple",bg:"grid",marker:"bar",btn:"flat",tab:"underline",density:"compact"}],
  ["minimal","بسيط جداً","بلا زخارف ولا نقوش، مساحات واسعة",{rCard:16,rBtn:10,shadow:"none",hero:"plain",mosque:false,moon:false,bg:"none",marker:"none",btn:"flat",tab:"soft",stripe:false,density:"roomy"}],
  ["header","شريط علوي ملوّن","الشريط العلوي بلون المنصة، وترحيب أزرق",{top:"primary",stripe:false,bg:"stars"}]
];
function dzRoleNow(){if(ui.view==="custom"&&Array.isArray(ui.dzRoles)&&ui.dzRoles.length)return ui.dzRoles[0];try{const m=me();return m&&m.role}catch(e){return null}}
function design(){if(ui.cmp)return {...DESIGN_DEF};const b=(brand().design)||{};const d={...DESIGN_DEF,...b};const r=dzRoleNow();const o=r&&b.byRole&&b.byRole[r];if(o){const x={...d,...o};x.free=d.free;x.byRole=b.byRole;x.icImgs=d.icImgs;return x}return d}
const dzNum=(v,a,b,def)=>{v=Number(v);return isFinite(v)?Math.min(b,Math.max(a,v)):def};
function dzPattern(kind,op){const o=(dzNum(op,0,30,6)/100).toFixed(2);const c="%2324406f";
  if(kind==="dots")return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Ccircle cx='13' cy='13' r='1.6' fill='${c}' fill-opacity='${o}'/%3E%3C/svg%3E")`;
  if(kind==="grid")return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M32 0H0V32' fill='none' stroke='${c}' stroke-opacity='${o}'/%3E%3C/svg%3E")`;
  if(kind==="stars")return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg fill='none' stroke='${c}' stroke-opacity='${o}' stroke-width='1.2'%3E%3Cpath d='M30 14 L34 26 L46 30 L34 34 L30 46 L26 34 L14 30 L26 26 Z'/%3E%3Cpath d='M90 74 L94 86 L106 90 L94 94 L90 106 L86 94 L74 90 L86 86 Z'/%3E%3C/g%3E%3C/svg%3E")`;
  return "none"}
function designCSS(d){
  const rc=dzNum(d.rCard,0,40,22),rb=dzNum(d.rBtn,0,999,12),ri=dzNum(d.rInput,0,24,10),bw=dzNum(d.border,0,3,1);
  const den={compact:[12,10,8],normal:[16,14,10],roomy:[22,20,14]}[d.density]||[16,14,10];
  const sh={none:"none",soft:"0 2px 6px rgba(36,64,111,.04),0 12px 30px rgba(36,64,111,.07)",medium:"0 4px 10px rgba(20,40,80,.06),0 18px 40px rgba(20,40,80,.12)",strong:"0 8px 18px rgba(20,40,80,.10),0 26px 60px rgba(20,40,80,.18)"}[d.shadow]||"";
  let c=`:root{--r:${rc}px;${sh?`--shadow:${sh};`:""}}
.card{border-radius:${rc}px;padding:${den[0]}px;border-width:${bw}px}
.stat{border-radius:${Math.max(0,rc-4)}px;border-width:${bw}px}
.crow,.tbl-wrap,.font-card,.divcard{border-radius:${Math.max(0,Math.min(rc,16))}px}
.grid{gap:${den[1]}px}.stack{gap:${den[2]}px}
.btn{border-radius:${rb}px}
input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]),select,textarea{border-radius:${ri}px!important}
.pill,.kind,.bellbadge{border-radius:${d.pill==="square"?6:999}px}
.wrap{max-width:${dzNum(d.width,860,1600,1120)}px}
body.app main.wrap{max-width:${dzNum(d.appWidth,420,900,640)}px}
.stats{grid-template-columns:repeat(auto-fit,minmax(${dzNum(d.statMin,90,260,130)}px,1fr))}
.stat b{font-size:${dzNum(d.statNum,1,2.6,1.45)}rem}
.greet,.today-card{border-radius:${rc+4}px}
`;
  if(d.statBar===false)c+=`.stat::before{display:none}.stat{background:var(--surface)}`;
  if(d.cols==="1")c+=`.g2{grid-template-columns:1fr}`;else if(d.cols==="2")c+=`@media(min-width:760px){.g2{grid-template-columns:1fr 1fr}}`;else if(d.cols==="3")c+=`@media(min-width:900px){.g2{grid-template-columns:repeat(3,1fr)}}`;
  c+=`body{background-image:${dzPattern(d.bg,d.bgOp)}}:root[data-theme="dark"] body{background-image:none}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) body{background-image:none}}`;
  const mk={diamond:`width:7px;height:7px;border-radius:2px;background:var(--accent);transform:rotate(45deg) translateY(-2px)`,bar:`width:4px;height:1em;border-radius:2px;background:linear-gradient(var(--primary),var(--teal));transform:translateY(3px)`,none:`display:none`,square:``}[d.marker];
  if(mk)c+=`h2::before,.card-h h3::before{${mk}}`;
  if(d.btn==="flat")c+=`.btn.pri{background:var(--primary);border-color:var(--primary)}`;
  if(d.btn==="outline")c+=`.btn.pri{background:transparent;color:var(--primary);border:1.5px solid var(--primary);box-shadow:none}`;
  if(d.tab==="soft")c+=`.tabbar button.on .ti{background:var(--primary-soft);color:var(--primary)}`;
  if(d.tab==="underline")c+=`.tabbar button.on .ti{background:none;color:var(--primary)}.tabbar button.on{box-shadow:inset 0 3px 0 var(--primary)}`;
  if(d.top==="primary")c+=`:root{--top:var(--primary);--top-ink:#fff;--top-muted:rgba(255,255,255,.78);--top-on:rgba(255,255,255,.18);--top-on-ink:#fff}`;
  if(d.top==="gradient")c+=`.top{background:linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 55%,var(--teal)))!important}:root{--top-ink:#fff;--top-muted:rgba(255,255,255,.78);--top-on:rgba(255,255,255,.18);--top-on-ink:#fff}`;
  if(!d.stripe)c+=`.top::after{display:none}`;
  if(d.hero==="poster"||d.hero==="color"){const mo=d.hero==="poster"&&d.mosque,mn=d.hero==="poster"&&d.moon;
    c+=`:root:is([data-hero="poster"],[data-hero="color"]) .greet::after{background-size:${mo?"min(440px,92%) auto":"0 0"},${mn?"120px auto":"0 0"},auto,auto!important}
:root:is([data-hero="poster"],[data-hero="color"]) .today-card::after{background-size:${mo?"min(440px,92%) auto":"0 0"},0 0,auto,auto!important}
:root:is([data-hero="poster"],[data-hero="color"]) .greet,:root:is([data-hero="poster"],[data-hero="color"]) .today-card{padding-bottom:${mo?64:dzNum(d.heroPad,10,48,22)}px!important}`}
  if(d.hero==="plain")c+=`.greet::after,.today-card::after{display:none}.greet.pattern,.today-card.pattern{background-image:none}`;
  const fs=dzNum(d.fs,13,20,16);if(fs!==16)c+=`body{font-size:${fs}px}`;
  c+=compCSS(d.comp);
  if(d.css)c+=String(d.css).replace(/<\/?style|@import|javascript:/gi,"").slice(0,20000);
  return c}
function setDesign(p,replace){const b=brand();const cur=b.design||{};const keep={};["free","byRole","icImgs"].forEach(k=>{if(cur[k]!==undefined)keep[k]=cur[k]});
  const RS=ui.view==="custom"&&Array.isArray(ui.dzRoles)&&ui.dzRoles.length&&!("free" in p)&&!("byRole" in p)?ui.dzRoles:null;
  if(RS){const BR={...(cur.byRole||{})};const q={...p};delete q.icImgs;RS.forEach(r=>{BR[r]=replace?{...q}:{...(BR[r]||{}),...q,tpl:"custom"}});const nx={...cur,byRole:BR};if(p.icImgs)nx.icImgs=p.icImgs;saveUi({brand:{...b,design:nx}});return}
  const next=replace?{...keep,...p}:{...cur,...p,tpl:"custom"};saveUi({brand:{...b,design:next}})}
function dzRolesHTML(){const sel=Array.isArray(ui.dzRoles)?ui.dzRoles:[];const BR=((brand().design)||{}).byRole||{};const rs=["director","supervisor","teacher","assistant","examiner","student","parent"].filter(x=>ROLE[x]);
  return `<div class="card dz-scope"><div class="card-h"><h2>نطاق التعديل</h2>${sel.length?`<button class="btn sm" data-act="dzRoleClr">إزالة تخصيص ${sel.length>1?"الأدوار المحددة":"هذا الدور"}</button>`:""}</div><p class="hint">اختر «كل الأدوار» ليكون التعديل عاماً، أو اختر دوراً أو أكثر ليكون التصميم خاصاً بهم فقط (يتغلّب على العام). النقطة الذهبية = دور له تخصيص خاص.</p>
  <div class="dz-rchips"><button class="${!sel.length?"on":""}" data-act="dzRole" data-v="">كل الأدوار</button>${rs.map(r=>`<button class="${sel.includes(r)?"on":""}" data-act="dzRole" data-v="${r}">${esc(ROLE[r])}${BR[r]&&Object.keys(BR[r]).length?`<i class="dz-dot"></i>`:""}</button>`).join("")}</div>
  <small class="muted">${sel.length?`التعديلات تحت تُطبّق الآن على: <b>${sel.map(r=>esc(ROLE[r])).join("، ")}</b> — والمعاينة تعرض تصميم «${esc(ROLE[sel[0]])}».`:"التعديلات تحت تُطبّق على كل الأدوار."}</small></div>`}
function dzRange(k,l,min,max,step,unit,hint){const d=design();const v=d[k];return `<label class="dz-row"><span class="dz-l">${l}${hint?`<small class="muted">${hint}</small>`:""}</span><input type="range" min="${min}" max="${max}" step="${step||1}" value="${esc(String(v))}" data-change="dz" data-k="${k}" data-num="1" oninput="this.nextElementSibling.textContent=this.value+'${unit||""}'"><b class="dz-v num">${esc(String(v))}${unit||""}</b></label>`}
function dzSeg(k,l,opts){const d=design();return `<div class="dz-row"><span class="dz-l">${l}</span><div class="seg modeseg dz-seg">${opts.map(([v,t])=>`<button data-act="dzSet" data-k="${k}" data-v="${esc(String(v))}" class="${String(d[k])===String(v)?"on":""}">${t}</button>`).join("")}</div></div>`}
function dzTog(k,l){const d=design();return `<label class="switch" style="border:0;padding:4px 0"><span>${l}</span><input type="checkbox" data-change="dzb" data-k="${k}" ${d[k]?"checked":""}></label>`}
function designTabHTML(){const d=design();
  const tpls=DESIGN_TPLS.map(([k,n,h,p])=>{const dd={...DESIGN_DEF,...p};return `<button class="dz-tpl ${d.tpl===k?"on":""}" data-act="dzTpl" data-v="${k}"><span class="dz-thumb" style="--tr:${Math.min(dd.rCard,18)}px;--tb:${Math.min(dd.rBtn,10)}px"><i class="h ${dd.hero}"></i><i class="c"></i><i class="c"></i><i class="b ${dd.btn}"></i></span><b>${esc(n)}</b><small>${esc(h)}</small>${d.tpl===k?`<span class="pill p-ok">مطبّق</span>`:""}</button>`}).join("");
  const prev=`<div class="dz-prev"><div class="hero greet pattern"><div><div class="verse">«خيرُكم مَن تعلَّم القرآنَ وعلَّمه»</div><h1>السلام عليكم، عبدالله</h1><div class="date">معاينة مباشرة للتصميم</div></div><div class="row"><button class="btn pri" type="button">زر أساسي</button><button class="btn" type="button">زر ثانوي</button></div></div>
  <div class="stats"><div class="stat"><b class="num">12</b><span>طالب</span></div><div class="stat"><b class="num">88%</b><span>الحضور</span></div><div class="stat"><b class="num">34</b><span>وجه محفوظ</span></div></div>
  <div class="grid g2"><div class="card"><div class="card-h"><h2>عنوان بطاقة</h2><span class="pill p-acc">شارة</span></div><p class="muted small">نص توضيحي داخل البطاقة.</p><input placeholder="حقل إدخال"></div><div class="card"><div class="card-h"><h2>بطاقة ثانية</h2></div><div class="row"><span class="pill">حاضر</span><span class="pill p-yel">متأخر</span></div></div></div></div>`;
  return dzRolesHTML()+dzSnapsHTML()+`<div class="card"><div class="card-h"><h2>القوالب الجاهزة</h2><button class="btn sm" data-act="dzReset">الرجوع للافتراضي</button></div><p class="hint">اختر قالباً ثم عدّل أي تفصيل تحت. التعديلات تظهر فوراً كمعاينة، واضغط «حفظ التعديلات» لتظهر للجميع.</p><div class="dz-tpls">${tpls}</div></div>
  ${dzMyHTML()}
  <div class="card"><div class="card-h"><h2>الأيقونات</h2></div><p class="hint">شكل ولون أيقونات العناوين والإحصاءات. لتغيير أيقونة عنصر معيّن: «تحريك العناصر» ← اضغط العنوان ← قسم «الأيقونة».</p>
  ${dzSeg("icStyle","النمط",[["soft","ناعم"],["solid","مصمت"],["line","إطار"],["plain","بدون خلفية"],["off","إيقاف"]])}
  <div class="dz-row"><span class="dz-l">اللون</span><div class="row" style="gap:6px"><input type="color" value="${okCol(d.icColor)||"#1fa6c6"}" data-change="dz" data-k="icColor" class="${okCol(d.icColor)?"":"dz-unset"}"><button type="button" class="btn sm ghost" data-act="dzSet" data-k="icColor" data-v="">تلقائي</button><span class="row" style="gap:4px">${["#1fa6c6","#24406f","#f0a91e","#21875a","#7c4dbe","#c2453b"].map(c=>`<button type="button" class="btn sm" style="width:22px;height:22px;padding:0;border-radius:50%;background:${c};border:2px solid ${d.icColor===c?"var(--ink)":"transparent"}" data-act="dzSet" data-k="icColor" data-v="${c}" title="${c}"></button>`).join("")}</span></div></div>
  ${dzRange("icSize","الحجم",20,64,1,"px")}${dzRange("icRad","الاستدارة",0,50,1,"%","0 مربع · 50 دائرة")}${dzRange("icStroke","سُمك الخط",1,3,0.25,"")}
  ${dzTog("icHead","أيقونات العناوين")}${dzTog("icStat","أيقونات مربعات الإحصاء")}
  <div class="dz-icprev">${["users","halaqa","book","clock","award","chart","trophy"].map(k=>`<span style='--ic:${dicURL(k,icFg())}'></span>`).join("")}</div></div>
  <div class="dz-layout"><div class="stack" style="gap:16px">
  ${dzCompHTML()}
  <div class="card"><div class="card-h"><h2>الحواف والأشكال</h2></div><div class="stack">${dzRange("rCard","حواف البطاقات",0,40,1,"px")}${dzRange("rBtn","حواف الأزرار",0,30,1,"px","30 = دائرية بالكامل")}${dzRange("rInput","حواف الحقول",0,24,1,"px")}${dzRange("border","سماكة إطار البطاقات",0,3,1,"px")}${dzSeg("pill","الشارات",[["round","دائرية"],["square","مربعة"]])}${dzSeg("shadow","الظلال",[["none","بلا"],["soft","ناعم"],["medium","متوسط"],["strong","قوي"]])}</div></div>
  <div class="card"><div class="card-h"><h2>الأحجام والمسافات</h2></div><div class="stack">${dzSeg("density","المسافات",[["compact","مضغوط"],["normal","عادي"],["roomy","واسع"]])}${dzRange("width","عرض الصفحة على الكمبيوتر",860,1600,20,"px")}${dzRange("appWidth","عرض صفحة الطالب وولي الأمر",420,900,10,"px")}${dzRange("statMin","أقل عرض لمربعات الأرقام",90,260,5,"px")}${dzRange("statNum","حجم الأرقام في المربعات",1,2.6,.05,"rem")}${dzTog("statBar","شريط ذهبي جانبي في مربعات الأرقام")}${dzRange("fs","حجم النص الأساسي",13,20,1,"px")}${dzSeg("cols","أعمدة البطاقات",[["auto","تلقائي"],["1","عمود"],["2","عمودان"],["3","ثلاثة"]])}</div></div>
  <div class="card"><div class="card-h"><h2>بطاقة الترحيب</h2></div><div class="stack">${dzSeg("hero","الشكل",[["poster","بوستر"],["color","ملوّن"],["simple","فاتح بنقش"],["plain","بسيط"]])}${d.hero==="poster"?dzTog("mosque","رسمة المسجد")+dzTog("moon","الهلال والنجوم"):""}${dzRange("heroPad","المسافة أسفل البطاقة",10,48,2,"px","عند إخفاء المسجد")}</div></div>
  <div class="card"><div class="card-h"><h2>الشريط العلوي والقائمة</h2></div><div class="stack">${dzSeg("top","الشريط العلوي",[["white","أبيض"],["primary","بلون المنصة"],["gradient","متدرّج"]])}${dzTog("stripe","الخط الملوّن أسفل الشريط")}${dzSeg("tab","الزر المختار في القائمة السفلية",[["gradient","متدرّج"],["soft","فاتح"],["underline","خط"]])}${dzSeg("btn","الأزرار الأساسية",[["gradient","متدرّجة"],["flat","لون واحد"],["outline","إطار فقط"]])}${dzSeg("marker","علامة العناوين",[["square","مربع ذهبي"],["diamond","معيّن"],["bar","خط"],["none","بلا"]])}</div></div>
  <div class="card"><div class="card-h"><h2>الخلفية</h2></div><div class="stack">${dzSeg("bg","النقش",[["stars","نجوم"],["dots","نقاط"],["grid","مربعات"],["none","بلا"]])}${dzRange("bgOp","وضوح النقش",0,30,1,"%")}</div></div>
  <div class="card"><div class="card-h"><h2>CSS مخصص (متقدم)</h2></div><p class="hint">لأي تعديل غير موجود أعلاه. مثال: <code dir="ltr">.card{border:2px dashed var(--teal)}</code></p><textarea dir="ltr" style="min-height:140px;font-family:monospace" data-change="dzCss">${esc(d.css||"")}</textarea></div>
  <div class="card"><div class="card-h"><h2>أماكن الأقسام</h2></div><p class="hint">ترتيب أقسام الصفحة الرئيسية وإخفاؤها، وترتيب القائمة العلوية لكل دور:</p><div class="row"><button class="btn sm" data-act="ctab" data-v="home">ترتيب الصفحة الرئيسية</button><button class="btn sm" data-act="ctab" data-v="nav">ترتيب القائمة</button><button class="btn sm" data-act="ctab" data-v="brand">الألوان والخطوط</button></div></div>
  </div><div class="dz-side"><div class="card"><div class="card-h"><h2>معاينة</h2></div>${prev}</div></div></div>`}

/* ===== محرر العناصر (لكل عنصر: ألوان، حدود، حواف، مسافات، خط، ظل، صورة خلفية) + قوالبي ===== */
const COMP=[["card","البطاقات",".card"],["stat","مربعات الأرقام",".stat"],["statnum","أرقام المربعات",".stat b"],["hero","بطاقة الترحيب",".greet,.today-card"],["btnpri","الزر الأساسي",".btn.pri"],["btn","الأزرار الثانوية",".btn:not(.pri):not(.meet)"],["pill","الشارات",".pill"],["input","الحقول","input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]),select,textarea"],["top","الشريط العلوي",".top"],["tabbar","القائمة السفلية",".tabbar"],["title","العناوين","h2,.card-h h3,.hero:not(.greet) h1"],["text","الصفحة والنص العام","body"],["modal","النوافذ المنبثقة",".dlg"],["table","رؤوس الجداول","table th"]];
const okCssUrl=u=>/^(https:\/\/|blob:|data:image\/)/.test(String(u||""))?String(u).replace(/["\\\n\r]/g,""):"";
const okCol=v=>/^#[0-9a-f]{3,8}$/i.test(String(v||""))?v:"";
const hexA=(h,a)=>{h=String(h).replace("#","");if(h.length===3)h=h.split("").map(x=>x+x).join("");const n=parseInt(h.slice(0,6),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`};
function compImg(p){const u=okCssUrl(p.img);if(!u)return "";const ov=okCol(p.ov)?`linear-gradient(${hexA(p.ov,dzNum(p.ovo,0,100,40)/100)},${hexA(p.ov,dzNum(p.ovo,0,100,40)/100)}),`:"";
  const sz={cover:"cover",contain:"contain",auto:"auto",repeat:"auto"}[p.isz]||"cover";const pos={top:"center top",bottom:"center bottom",center:"center"}[p.ipos]||"center";
  return {bg:`${ov}url("${u}")`,size:sz,pos,rep:p.isz==="repeat"?"repeat":"no-repeat"}}
function compCSS(C){let c="";if(!C)return c;const SH={none:"none",soft:"0 2px 6px rgba(36,64,111,.04),0 12px 30px rgba(36,64,111,.07)",medium:"0 4px 10px rgba(20,40,80,.06),0 18px 40px rgba(20,40,80,.12)",strong:"0 8px 18px rgba(20,40,80,.10),0 26px 60px rgba(20,40,80,.18)"};
  for(const [k,,sel] of COMP){const p=C[k];if(!p||typeof p!=="object")continue;const S=sel.split(",").map(x=>x.trim()==="body"?"html:root[data-hero] body":"html:root[data-hero] body "+x.trim()).join(",");let r="";const im=compImg(p);
    if(k==="hero"){let v="";["c1","c2","c3"].forEach((x,i)=>{if(okCol(p[x]))v+=`--hero${i+1}:${p[x]};`});if(v)c+=`:root{${v}}`;
      if(im)c+=`html:root[data-hero] body .greet::after,html:root[data-hero] body .today-card::after{background:${im.bg} ${im.pos}/${im.size} ${im.rep}!important}`;
      if(okCol(p.fg))c+=`html:root[data-hero] body .greet,html:root[data-hero] body .today-card,html:root[data-hero] body .greet h1,html:root[data-hero] body .today-card h1,html:root[data-hero] body .greet .date,html:root[data-hero] body .today-card .date{color:${p.fg}!important}`;
      if(p.r!=null)r+=`border-radius:${dzNum(p.r,0,60,26)}px!important;`;if(p.py!=null)r+=`padding-top:${dzNum(p.py,0,80,22)}px!important;padding-bottom:${dzNum(p.py,0,80,22)}px!important;`;if(p.sh&&SH[p.sh])r+=`box-shadow:${SH[p.sh]}!important;`;
      if(r)c+=`${S}{${r}}`;continue}
    if(okCol(p.bg)){r+=`background-color:${p.bg}!important;`;if(!im&&k!=="text")r+=`background-image:none!important;`}
    if(im)r+=`background-image:${im.bg}!important;background-size:${im.size}!important;background-position:${im.pos}!important;background-repeat:${im.rep}!important;${k==="text"?"background-attachment:fixed!important;":""}`;
    if(okCol(p.fg))r+=`color:${p.fg}!important;`;if(okCol(p.bc))r+=`border-color:${p.bc}!important;`;
    if(p.bw!=null)r+=`border-width:${dzNum(p.bw,0,8,1)}px!important;border-style:${p.bs||"solid"}!important;`;else if(p.bs)r+=`border-style:${p.bs}!important;`;
    if(p.r!=null)r+=`border-radius:${dzNum(p.r,0,999,12)}px!important;`;
    if(p.px!=null)r+=`padding-inline:${dzNum(p.px,0,80,16)}px!important;`;if(p.py!=null)r+=`padding-block:${dzNum(p.py,0,80,12)}px!important;`;
    if(p.fs!=null)r+=`font-size:${dzNum(p.fs,9,72,16)}px!important;`;if(p.fw)r+=`font-weight:${dzNum(p.fw,300,900,600)}!important;`;
    if(p.sh&&SH[p.sh])r+=`box-shadow:${SH[p.sh]}!important;`;
    if(r)c+=`${S}{${r}}`}
  return c}
function setComp(k,prop,val){const d=design();const C={...(d.comp||{})};const p={...(C[k]||{})};if(val===""||val==null)delete p[prop];else p[prop]=val;C[k]=p;setDesign({comp:C})}
function dzColor(k,prop,l){const p=(design().comp||{})[k]||{};const v=okCol(p[prop]);return `<div class="dz-row"><span class="dz-l">${l}</span><div class="row" style="gap:6px"><input type="color" value="${v||"#ffffff"}" data-change="dzc" data-c="${k}" data-p="${prop}" class="${v?"":"dz-unset"}"><button type="button" class="btn sm ghost" data-act="dzcClr" data-c="${k}" data-p="${prop}">${v?"مسح":"تلقائي"}</button></div><span></span></div>`}
function dzcRange(k,prop,l,min,max,step,unit,def){const p=(design().comp||{})[k]||{};const set=p[prop]!=null;const v=set?p[prop]:def;return `<label class="dz-row"><span class="dz-l">${l}</span><input type="range" min="${min}" max="${max}" step="${step||1}" value="${esc(String(v))}" data-change="dzc" data-c="${k}" data-p="${prop}" data-num="1" oninput="this.nextElementSibling.textContent=this.value+'${unit||""}'"><b class="dz-v num ${set?"":"muted"}">${set?esc(String(v))+(unit||""):"تلقائي"}</b></label>`}
function dzcSeg(k,prop,l,opts){const p=(design().comp||{})[k]||{};return `<div class="dz-row"><span class="dz-l">${l}</span><div class="seg modeseg dz-seg"><button data-act="dzcSet" data-c="${k}" data-p="${prop}" data-v="" class="${p[prop]==null||p[prop]===""?"on":""}">تلقائي</button>${opts.map(([v,t])=>`<button data-act="dzcSet" data-c="${k}" data-p="${prop}" data-v="${v}" class="${String(p[prop])===String(v)?"on":""}">${t}</button>`).join("")}</div></div>`}
function dzImgCtl(k){const p=(design().comp||{})[k]||{};const u=okCssUrl(p.img);return `<div class="dz-row"><span class="dz-l">صورة خلفية<small class="muted">صمّمها في فوتوشوب وارفعها</small></span><div class="row" style="gap:6px;flex-wrap:wrap">${u?`<span class="dz-imgprev" style="background-image:url('${u}')"></span>`:""}<label class="btn sm">${u?"تغيير الصورة":"رفع صورة"}<input type="file" accept="image/*" hidden data-change="dzImg" data-c="${k}"></label>${u?`<button type="button" class="btn sm ghost danger" data-act="dzcClr" data-c="${k}" data-p="img">إزالة</button>`:""}</div><span></span></div>${u?dzcSeg(k,"isz","حجم الصورة",[["cover","تغطية"],["contain","احتواء"],["auto","أصلي"],["repeat","تكرار"]])+dzcSeg(k,"ipos","موضع الصورة",[["top","أعلى"],["center","وسط"],["bottom","أسفل"]])+dzColor(k,"ov","طبقة لونية فوق الصورة")+dzcRange(k,"ovo","شفافية الطبقة",0,100,5,"%",40):""}`}
function dzCompHTML(){const d=design();const k=ui.dzComp||"card";const C=d.comp||{};const meta=COMP.find(x=>x[0]===k)||COMP[0];
  const chips=COMP.map(([c,l])=>`<button class="${c===k?"on":""}" data-act="dzComp" data-v="${c}">${esc(l)}${C[c]&&Object.keys(C[c]).length?" •":""}</button>`).join("");
  let f="";
  if(k==="hero")f=dzColor(k,"c1","لون التدرّج ١")+dzColor(k,"c2","لون التدرّج ٢")+dzColor(k,"c3","لون التدرّج ٣")+dzColor(k,"fg","لون النص")+dzcRange(k,"r","الحواف",0,60,1,"px",26)+dzcRange(k,"py","المسافة الداخلية",0,80,2,"px",22)+dzcSeg(k,"sh","الظل",[["none","بلا"],["soft","ناعم"],["medium","متوسط"],["strong","قوي"]])+dzImgCtl(k);
  else f=dzColor(k,"bg","لون الخلفية")+dzColor(k,"fg","لون النص")+dzColor(k,"bc","لون الإطار")+dzcRange(k,"bw","سماكة الإطار",0,8,1,"px",1)+dzcSeg(k,"bs","نوع الإطار",[["solid","متصل"],["dashed","متقطع"],["dotted","منقّط"],["double","مزدوج"]])+dzcRange(k,"r","الحواف",0,60,1,"px",12)+dzcRange(k,"px","المسافة الداخلية أفقياً",0,80,1,"px",16)+dzcRange(k,"py","المسافة الداخلية عمودياً",0,80,1,"px",12)+dzcRange(k,"fs","حجم الخط",9,72,1,"px",16)+dzcSeg(k,"fw","سماكة الخط",[["400","عادي"],["500","متوسط"],["600","شبه عريض"],["700","عريض"],["800","عريض جداً"]])+dzcSeg(k,"sh","الظل",[["none","بلا"],["soft","ناعم"],["medium","متوسط"],["strong","قوي"]])+dzImgCtl(k);
  return `<div class="card"><div class="card-h"><h2>محرر العناصر</h2><button class="btn sm" data-act="dzcReset" data-c="${k}">إرجاع «${esc(meta[1])}» للأصل</button></div><p class="hint">اختر أي عنصر، وغيّر ألوانه وإطاره وحوافه ومسافاته وخطه وظله، أو ارفع له صورة خلفية من تصميمك. «تلقائي» يعني يتبع القالب.</p><div class="subtabs dz-chips">${chips}</div><div class="stack" style="margin-top:12px">${f}</div></div>`}
function dzMyHTML(){const T=brand().myTpls||[];
  return `<div class="card"><div class="card-h"><h2>قوالبي</h2><div class="row"><button class="btn sm" data-act="dzExport">تصدير التصميم</button><button class="btn sm" data-act="dzImport">استيراد تصميم</button></div></div><p class="hint">احفظ تصميمك الحالي كقالب باسمك، وارجع له متى شئت، أو صدّره وانقله لمنصة أخرى.</p>
  <div class="row" style="gap:8px;margin-bottom:10px"><input id="dz-tname" placeholder="اسم القالب، مثل: نمط رمضان" style="flex:1;min-width:160px"><button class="btn pri sm" data-act="dzSaveTpl">حفظ التصميم الحالي كقالب</button></div>
  ${T.length?`<div class="stack" style="gap:6px">${T.map((t,i)=>`<div class="crow"><b class="grow">${esc(t.n||"قالب")}</b><button class="btn sm" data-act="dzMyApply" data-i="${i}">تطبيق</button><button class="btn sm ghost danger" data-act="dzMyDel" data-i="${i}">حذف</button></div>`).join("")}</div>`:`<p class="muted small">لا قوالب محفوظة بعد.</p>`}</div>`}

/* ===== محرر تخطيط الصفحة الرئيسية: سحب وترتيب وتغيير الحجم وإضافة وحذف ===== */

/* ===== فصل تخصيص الكمبيوتر عن الجوال ===== */
const editing=()=>!!(ui.homeEdit||ui.freeEdit);
const edDev=()=>ui.editDev||"all";
const isMobV=()=>editing()&&edDev()!=="all"?edDev()==="m":innerWidth<760;
const DEV_IC={d:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,m:`<svg width="14" height="16" viewBox="0 0 16 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="1.5" width="12" height="21" rx="2.5"/><path d="M7 19h2"/></svg>`};
function devBtns(){if(!editing())return"";const v=edDev();return `<div class="dev-sw" role="group" aria-label="التعديل على"><button type="button" data-act="devSet" data-v="d" class="${v==="d"?"on":""}" title="التعديل على الكمبيوتر فقط">${DEV_IC.d}<span>كمبيوتر</span></button><button type="button" data-act="devSet" data-v="m" class="${v==="m"?"on":""}" title="التعديل على الجوال فقط">${DEV_IC.m}<span>جوال</span></button><button type="button" data-act="devSet" data-v="all" class="${v==="all"?"on":""}" title="التعديل على الاثنين معاً">الكل</button></div>`}
const devKey=()=>isMobV()?"homeM":"homeD";
const devName=()=>isMobV()?"الجوال":"الكمبيوتر";
const hasOv=g=>!!(((uiCfg()[devKey()])||{})[g]);
const layScope=g=>edDev()==="all"?"both":"dev";
const feScope=()=>edDev()==="all"?"both":"dev";
const feDevKey=k=>k?k.replace("|",(isMobV()?"@m":"@d")+"|"):k;
const feKey=()=>feScope()==="dev"?feDevKey(ui.feSel):ui.feSel;

/* تحديد أكثر من عنصر (Shift مع النقر) وتحريكها معاً */
const feSet=()=>ui.feMulti&&ui.feMulti.length?ui.feMulti:(ui.feSel?[ui.feSel]:[]);
const feKeyOf=b=>feScope()==="dev"?feDevKey(b):b;
const feValOf=b=>{const F=design().free||{};return {...(F[b]||{}),...(F[feDevKey(b)]||{})}};
function feRoleKeys(b){const i=b.indexOf(":");const R=b.slice(0,i);const T=ui.feRoles==="all"?Object.keys(ROLE):(Array.isArray(ui.feRoles)?ui.feRoles:[]);return [b,...T.filter(t=>t!==R).map(t=>t+b.slice(i))]}
const setFreeOne=p=>setFreeMany(b=>b===ui.feSel?p:{});
function setFreeMany(fn){const d=design();const F={...(d.free||{})};feSet().forEach(b0=>{const patch0=fn(b0,feValOf(b0));if(!Object.keys(patch0).length)return;feRoleKeys(b0).forEach(b=>{const k=feKeyOf(b);const patch=patch0;if(k===b){["@m","@d"].forEach(sx=>{const dk=b.replace("|",sx+"|");if(F[dk]){const dc={...F[dk]};Object.keys(patch).forEach(x=>{if(x in dc){if(patch[x]===""||patch[x]==null)delete dc[x];else dc[x]=patch[x]}});F[dk]=dc}})}const cur={...(F[k]||{}),...patch};Object.keys(cur).forEach(x=>{if(cur[x]===""||cur[x]==null||cur[x]===false||(cur[x]===0&&(x==="x"||x==="y")))delete cur[x]});if(Object.keys(cur).length)F[k]=cur;else delete F[k]})});setDesign({free:F})}
const feElOf=b=>{const p=b.split("|").slice(1).join("|");return feOkPath(p)?document.querySelector(p):null};
const feVal=()=>{const F=design().free||{};return {...(F[ui.feSel]||{}),...(F[feDevKey(ui.feSel)]||{})}};
(function(){let lastM=innerWidth<760;addEventListener("resize",()=>{const m=isMobV();if(m!==lastM){lastM=m;try{render()}catch(e){}}});})();
const HB_W=[[3,"ربع"],[4,"ثلث"],[6,"نصف"],[8,"ثلثان"],[9,"ثلاثة أرباع"],[12,"كامل"]];
const hbSpan=it=>{const w=it.w;if(w==="full")return 12;if(w==="half")return 6;const n=Number(w);if(n>=2&&n<=12)return Math.round(n);return it.full?12:6};
const homeCustom=g=>(((uiCfg().homeCustom)||{})[g])||[];
function hbCustomHTML(c){const img=okCssUrl(c.img);const link=/^https:\/\//.test(c.link||"")?c.link:"";
  return `<div class="card hb-custom" style="${okCol(c.bg)?`background:${c.bg};`:""}${okCol(c.fg)?`color:${c.fg};`:""}">${img&&c.imgMode!=="bg"?`<img class="hb-img" src="${esc(img)}" alt="">`:""}${c.t?`<div class="card-h"><h2 ${okCol(c.fg)?`style="color:${c.fg}"`:""}>${esc(c.t)}</h2></div>`:""}${c.x?`<p class="hb-txt">${esc(c.x)}</p>`:""}${link?`<a class="btn pri" href="${esc(link)}" target="_blank" rel="noopener">${esc(c.lt||"افتح الرابط")}</a>`:""}</div>`}
function homeLayout(g,B){
  const m=me();const canEd=isDir()&&MODE!=="loading";const ed=canEd&&ui.homeEdit===g;
  homeCustom(g).forEach(c=>{B["cx:"+c.id]=hbCustomHTML(c);const bg=okCssUrl(c.img);if(bg&&c.imgMode==="bg")B["cx:"+c.id]=B["cx:"+c.id].replace('class="card hb-custom" style="',`class="card hb-custom hb-bgimg" style="background-image:url('${bg}');`)});
  const items=homeOrder(g);let out="";const segs=[];
  items.forEach(it=>{if(!B[it.k])return;if(it.h&&!ed)return;const sp=hbSpan(it);const hh=Number(it.hh)||0;
    const tools=ed?`<div class="hb-tools" contenteditable="false"><span class="hb-grip" title="اسحب لتغيير المكان">⠿</span><b class="hb-name">${esc(it.l)}</b><select data-change="hbSz" data-g="${g}" data-k="${it.k}" title="الحجم" class="hb-szsel">${[["","حجم حر"],["s","صغير ▢"],["m","متوسط ▭"],["l","كبير ◻"]].map(([v,l])=>`<option value="${v}" ${(it.sz||"")===v?"selected":""}>${l}</option>`).join("")}</select>${it.sz?"":`<select data-change="hbW" data-g="${g}" data-k="${it.k}" title="العرض">`}${HB_W.map(([v,l])=>`<option value="${v}" ${v===sp?"selected":""}>${l}</option>`).join("")}${HB_W.some(x=>x[0]===sp)?"":`<option value="${sp}" selected>${sp}/12</option>`}${it.sz?"":"</select>"}<button type="button" class="hb-b" data-act="hbMove" data-g="${g}" data-k="${it.k}" data-n="-1" title="قبله">→</button><button type="button" class="hb-b" data-act="hbMove" data-g="${g}" data-k="${it.k}" data-n="1" title="بعده">←</button><button type="button" class="hb-b ${it.st?"on":""}" data-act="hbStk" data-g="${g}" data-k="${it.k}" title="ادمجه مع المربع السابق في مجموعة تتقلب بالسحب">⧉ ${it.st?"مدمج":"دمج"}</button>${hh?`<button type="button" class="hb-b" data-act="hbH0" data-g="${g}" data-k="${it.k}" title="طول تلقائي">↕ تلقائي</button>`:""}${it.k.startsWith("cx:")?`<button type="button" class="hb-b" data-act="hbEditC" data-g="${g}" data-id="${it.k.slice(3)}" title="تعديل">✎</button><button type="button" class="hb-b danger" data-act="hbDelC" data-g="${g}" data-id="${it.k.slice(3)}" title="حذف">🗑</button>`:`<button type="button" class="hb-b ${it.h?"on":""}" data-act="hbHide" data-g="${g}" data-k="${it.k}" title="${it.h?"إظهار":"إخفاء"}">${it.h?"إظهار":"إخفاء"}</button>`}</div><span class="hb-rs" data-g="${g}" data-k="${it.k}" title="اسحب لتغيير العرض والطول، ونقرتان للطول التلقائي"></span>`:"";
    const szc=["s","m","l"].includes(it.sz)?it.sz:"";const _hb=`<div class="hb ${it.h?"hb-off":""} ${hh&&!szc?"hb-fix":""} ${szc?"hb-sz hb-sz-"+szc:""} ${it.st&&ed?"hb-stk-e":""}" data-hk="${esc(it.k)}" data-g="${g}" ${ed?`draggable="true"`:""} style="--span:${sp};${hh&&!szc?`--hh:${hh}px;`:""}">${tools}${B[it.k]}</div>`;const _L=segs[segs.length-1];if(!ed&&it.st&&_L)_L.c.push(B[it.k]);else segs.push({h:_hb,k:it.k,c:[B[it.k]],szc,sp,hh,g})});out=segs.map(hbStackOut).join("");
  const bar=canEd?(ed?`<div class="hb-bar"><b>وضع التخصيص</b><span class="muted small">اسحب أي مربع من ⠿ لتغيير مكانه، واسحب الزاوية السفلية لتغيير العرض والطول، ثم اضغط «حفظ التعديلات».</span>${devBtns()}<div class="row"><button class="btn sm pri" data-act="hbAdd" data-g="${g}">+ إضافة مربع</button><button class="btn sm" data-act="hbTpl" data-g="${g}">▦ القوالب</button><button class="btn sm" data-act="homeReset" data-g="${g}">الترتيب الافتراضي</button><button class="btn sm" data-act="hbEdit" data-g="">تم</button></div></div>`:`<div class="hb-entry"><button class="btn sm" data-act="hbEdit" data-g="${g}">✎ تخصيص الصفحة</button>${dirTools(g)}</div>`):"";
  return `${bar}<div class="hgrid ${ed?"editing":""} ${items.some(x=>!x.h&&(x.sz||x.st))?"hsz":""} ${(editing()&&edDev()==="all")?"":(hasOv(g)?"own":"")}" data-g="${g}">${out}</div>`}
function hbSave(g,items){saveHome(g,items)}
function hbModal(g,c){c=c||{};const T=homeOrder(g).filter(x=>x.h&&!x.k.startsWith("cx:"));
  const hidden=!c.id&&T.length?`<div class="card" style="padding:10px"><b class="small">أقسام مخفية تقدر ترجعها:</b><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">${T.map(x=>`<button type="button" class="btn sm" data-act="hbHide" data-g="${g}" data-k="${x.k}">+ ${esc(x.l)}</button>`).join("")}</div></div>`:"";
  openModal(c.id?"تعديل المربع":"إضافة مربع جديد",`${hidden}<p class="hint">مربع حر تصممه بنفسك: عنوان ونص وصورة من تصميمك وزر رابط.</p>
  ${fld("العنوان",inp("t",c.t||""))}${fld("النص",`<textarea name="x" style="min-height:90px">${esc(c.x||"")}</textarea>`)}
  ${fld("صورة (اختياري)",`<input type="file" name="img" accept="image/*">${okCssUrl(c.img)?`<label class="row small"><input type="checkbox" name="rmimg"> إزالة الصورة الحالية</label>`:""}`)}
  ${fld("طريقة عرض الصورة",`<select name="imgMode"><option value="top" ${c.imgMode!=="bg"?"selected":""}>فوق النص</option><option value="bg" ${c.imgMode==="bg"?"selected":""}>خلفية للمربع</option></select>`)}
  <div class="fg">${fld("رابط الزر (https)",inp("link",c.link||"","url","dir='ltr'"))}${fld("نص الزر",inp("lt",c.lt||""))}</div>
  <div class="fg">${fld("لون الخلفية",`<input type="color" name="bg" value="${okCol(c.bg)||"#ffffff"}"><label class="row small"><input type="checkbox" name="nobg" ${okCol(c.bg)?"":"checked"}> تلقائي</label>`)}${fld("لون النص",`<input type="color" name="fg" value="${okCol(c.fg)||"#1f3559"}"><label class="row small"><input type="checkbox" name="nofg" ${okCol(c.fg)?"":"checked"}> تلقائي</label>`)}</div>`,"hbCustom",{g,id:c.id||null},c.id?"حفظ":"إضافة")}

/* سحب المربعات لتغيير مكانها، وسحب الزاوية لتغيير العرض والطول */
(function(){let dragK=null,dragG=null;
document.addEventListener("dragstart",e=>{const hb=e.target.closest&&e.target.closest(".hgrid.editing .hb");if(!hb)return;dragK=hb.dataset.hk;dragG=hb.dataset.g;hb.classList.add("hb-drag");try{e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",dragK)}catch(_){}});
document.addEventListener("dragend",e=>{document.querySelectorAll(".hb-drag,.hb-over").forEach(x=>x.classList.remove("hb-drag","hb-over"));dragK=null});
document.addEventListener("dragover",e=>{const hb=e.target.closest&&e.target.closest(".hgrid.editing .hb");if(!hb||!dragK)return;e.preventDefault();document.querySelectorAll(".hb-over").forEach(x=>x!==hb&&x.classList.remove("hb-over"));if(hb.dataset.hk!==dragK)hb.classList.add("hb-over")});
document.addEventListener("drop",e=>{const hb=e.target.closest&&e.target.closest(".hgrid.editing .hb");if(!hb||!dragK)return;e.preventDefault();const g=dragG,to=hb.dataset.hk;if(to===dragK)return;
  const items=homeOrder(g);const i=items.findIndex(x=>x.k===dragK);const [it]=items.splice(i,1);let j=items.findIndex(x=>x.k===to);const r=hb.getBoundingClientRect();const after=document.dir==="rtl"||document.documentElement.dir==="rtl"?e.clientX<r.left+r.width/2:e.clientX>r.left+r.width/2;
  if(after||e.clientY>r.top+r.height*.75)j++;items.splice(j,0,it);hbSave(g,items)});
let rs=null;
document.addEventListener("pointerdown",e=>{const h=e.target.closest&&e.target.closest(".hb-rs");if(!h)return;e.preventDefault();const hb=h.closest(".hb");const grid=hb.parentElement;const gw=grid.getBoundingClientRect().width;
  rs={hb,g:h.dataset.g,k:h.dataset.k,x:e.clientX,y:e.clientY,w0:hb.getBoundingClientRect().width,h0:hb.getBoundingClientRect().height,col:gw/12,span:+getComputedStyle(hb).getPropertyValue("--span")||12,hh:null};h.setPointerCapture&&h.setPointerCapture(e.pointerId);hb.classList.add("hb-sizing")});
document.addEventListener("pointermove",e=>{if(!rs)return;const rtl=getComputedStyle(rs.hb).direction==="rtl";const dx=rtl?rs.x-e.clientX:e.clientX-rs.x;
  const span=Math.max(2,Math.min(12,Math.round((rs.w0+dx)/rs.col)));rs.span=span;rs.hb.style.setProperty("--span",span);
  const hh=Math.max(80,Math.round((rs.h0+e.clientY-rs.y)/10)*10);if(Math.abs(e.clientY-rs.y)>6){rs.hh=hh;rs.hb.style.setProperty("--hh",hh+"px");rs.hb.classList.add("hb-fix")}
  rs.hb.setAttribute("data-size",span+"/12"+(rs.hh?" · "+rs.hh+"px":""))});
document.addEventListener("pointerup",e=>{if(!rs)return;const r=rs;rs=null;r.hb.classList.remove("hb-sizing");const items=homeOrder(r.g);const x=items.find(y=>y.k===r.k);if(!x)return;x.w=r.span;x.full=r.span===12;if(r.hh)x.hh=r.hh;hbSave(r.g,items)});
document.addEventListener("dblclick",e=>{const h=e.target.closest&&e.target.closest(".hb-rs");if(!h)return;const items=homeOrder(h.dataset.g);const x=items.find(y=>y.k===h.dataset.k);if(x){delete x.hh;hbSave(h.dataset.g,items)}});
})();

/* ===== أدوات مدير البرنامج: عرض الواجهات بصفة أي دور + تحريك الأزرار والكلمات والعناوين بحرية ===== */
const isDir=()=>realPA();
function previewBar(){const r=realMe();if(!r||!(isPA(r)||r.role==="director"))return"";const pa=isPA(r);const cur=ui.asId?(String(ui.asId).startsWith("pv-")?vMember(ui.asId.slice(3)):get("members",ui.asId)):null;
  const order=["teacher","supervisor","assistant","examiner","student","parent"];const roles=order.filter(x=>ROLE[x]);
  const plist=cur?S.members.filter(x=>x.status==="active"&&x.role===cur.role):[];const people=cur?(plist.length?plist.slice(0,300).map(x=>`<option value="${x.id}" ${x.id===ui.asId?"selected":""}>${esc(x.name)}</option>`).join(""):`<option>لا يوجد أعضاء بعد — معاينة الواجهة فقط</option>`):"";
  return (ui.cmp?`<button class="cmp-flag" data-act="cmpToggle">تعرض الآن التصميم الأصلي — اضغط للرجوع لتعديلاتك</button>`:"")+`<div class="pv-bar"><div class="wrap"><strong>${cur?"تشاهد بصفة":"اعرض بصفة"}</strong><select class="pv-sel" data-change="asRoleSel" aria-label="الدور"><option value="">${pa&&r.role!=="director"?"مسؤول المنصة (أنا)":"المدير (أنا)"}</option>${roles.map(x=>`<option value="${x}" ${cur&&cur.role===x?"selected":""}>${esc(ROLE[x]||x)}</option>`).join("")}</select>${cur?`<label class="row small">الشخص: <select data-change="asSel">${people}</select></label>`:""}${(()=>{try{const m=me();const it=navItems(m,baseNav(m),false).filter(x=>!x.h);const cv=ui.view||(it[0]&&it[0].k);return `<label class="row small">الصفحة: <select data-change="asPage">${it.map(x=>`<option value="${esc(x.k)}" ${x.k===cv?"selected":""}>${esc(x.l)}</option>`).join("")}</select></label>`}catch(e){return""}})()}${pa?uhBtns():""}${pa?`<button class="btn sm ${ui.cmp?"cmp-on":""}" data-act="cmpToggle" title="قارن بين تصميمك والأصل">◐ ${ui.cmp?"عرض تعديلاتي":"قبل/بعد"}</button><button class="btn sm ${ui.freeEdit?"pri":""}" data-act="feToggle">✥ ${ui.freeEdit?"إيقاف التحريك":"تحريك العناصر"}</button>`:""}${pa&&editing()?`<span class="small">التعديل على:</span>${devBtns()}`:""}</div></div>`}
function asApply(id){Object.assign(ui,{asId:id||null,view:null,homeEdit:null,feSel:null,feMulti:null,editDev:null,circle:"all",teacher:"all",track:"all",q:"",sid:null,cid:null,pid:null,rsid:null,kid:null,mstu:"",stab:"plan",div:"all",npanel:false,tasmee:false,mheat:null});const m=me();const L=typeof divLock==="function"?divLock(m):null;if(L&&L.length===1)ui.div=L[0];closeModal();render();scrollTo(0,0)}
function asRole(r){const R=realMe();const list=S.members.filter(x=>x.status==="active"&&x.role===r&&(!R||x.id!==R.id));if(!list.length){asApply("pv-"+r);toast("لا يوجد عضو بهذا الدور بعد — تعرض الواجهة كمعاينة فارغة");return}
  const score=x=>r==="teacher"?S.members.filter(s=>s.teacherId===x.id).length:r==="parent"?(x.childIds||[]).length:r==="student"?S.tasks.filter(t=>t.studentId===x.id).length:0;list.sort((a,b)=>score(b)-score(a));asApply(list[0].id)}
setTimeout(()=>{["fePos","feMin","feShadow","feShapeReset","feIcNudge","feIcReset","feIcBgNone","uhUndo","uhRedo","feFmtCopy","feFmtPaste","cmpToggle","snapSave","snapLoad","snapDel","feIc","dzRole","dzRoleClr","feRoleSet","feSizeClr","fePart","fePartDel","devSet","hbScope","feScopeSet","asPick","asGo","asRole","asExit","feToggle","feNudge","feFs","feFw","feClr","feHide","feReset","feClose","hbEdit","hbMove","hbHide","hbH0","hbAdd","hbEditC","hbDelC"].forEach(k=>{const f=A[k];if(f)A[k]=el=>{if(!isDir())return;return f(el)}});["hbW","hbSz","asSel","asPage","feCol","feTxt"].forEach(k=>{const f=CH[k];if(f)CH[k]=el=>{if(!isDir())return;return f(el)}})},0);
function dirTools(g){if(!isDir())return"";return `<button class="btn sm" data-act="feToggle">✥ ${ui.freeEdit?"إيقاف التحريك":"تحريك العناصر"}</button><button class="btn sm" data-act="asPick">👁 عرض بصفة</button>`}
const FE_SEL="h1,h2,h3,h4,p,.btn,button,a,label,.pill,.kind,.stat,.verse,.date,img,small,b,strong,.ring,.avatar,.chip,.t3-i,li,.zm-ic,.zt-ic,.zh-ic,.zq,.zt,.zad-mini,.zad-hero,.zm-cd,.zm-two>span,.zm-list>span,.zm-n,.zm-t,.zt-t,.zt-n,.ti,.ni,.zd-pr>button,.kh-ring,.zd-ring,.dk,.hd,.zch,.zad-hod,.zh-next,.zh-cd,.zhh-top,.zhh-n,.zhh-side,.zhh-city,.zhh-tm,.zhh-cd>span,.zm-bar,.zhh-list,.zhh-list>span,.zh-time,.zh-iq,.zhh-list .pi,.zhh-list em,.today-card,.greet,.card,.li,.row-card,.badge,.msg-card";
const pvKey=()=>{const m=me();return (m?m.role:"guest")+":"+(ui.view||"home")};
function fePath(el){const root=el.closest("main,header.top,.tabbar");if(!root)return"";const rs=root.tagName==="MAIN"?"main":root.classList.contains("tabbar")?".tabbar":"header.top";const parts=[];let n=el;
  while(n&&n!==root){const p=n.parentElement;if(!p)return"";const i=[...p.children].indexOf(n)+1;parts.unshift(`${n.tagName.toLowerCase()}:nth-child(${i})`);n=p}
  return rs+" > "+parts.join(" > ")}
const feOkPath=p=>/^(main|header\.top|\.tabbar)( > [a-z0-9]+:nth-child\(\d+\))+$/.test(String(p||""));
function freeCSS(F){let c="",cm="",cd="";if(!F)return c;Object.entries(F).forEach(([k,v])=>{const i=k.indexOf("|");if(i<0||!v)return;let head=k.slice(0,i);const dev=/@m$/.test(head)?"m":/@d$/.test(head)?"d":"";head=head.replace(/@[md]$/,"");const pv=head.replace(/[^a-z:_-]/gi,""),path=k.slice(i+1);if(!feOkPath(path))return;
  let r="";const x=dzNum(v.x,-2000,2000,0),y=dzNum(v.y,-2000,2000,0);const zm=v.zm?dzNum(v.zm,.2,6,1):1;if(zm!==1)r+=`zoom:${zm}!important;`;if(x||y)r+=`transform:translate(${+(x/zm).toFixed(1)}px,${+(y/zm).toFixed(1)}px)!important;position:relative;z-index:2;`;
  if(v.fs)r+=`font-size:${dzNum(v.fs,8,120,16)}px!important;`;if(okCol(v.c))r+=`color:${v.c}!important;`;if(okCol(v.bg))r+=`background:${v.bg}!important;`;if(v.fw)r+=`font-weight:${dzNum(v.fw,300,900,700)}!important;`;if(v.hide)r+=`visibility:hidden!important;`;if(v.br!==undefined&&v.br!=="")r+=`border-radius:${dzNum(v.br,0,200,0)}px!important;`;if(v.bw!==undefined&&v.bw!=="")r+=`border:${dzNum(v.bw,0,20,0)}px solid ${okCol(v.bc)?v.bc:"var(--line)"}!important;`;if(v.sh!==undefined&&v.sh!=="")r+=`box-shadow:${v.sh==="0"?"none":v.sh==="2"?"0 10px 30px rgba(20,40,80,.22)":"0 4px 14px rgba(20,40,80,.12)"}!important;`;if(v.op!==undefined&&v.op!==""&&+v.op<100)r+=`opacity:${dzNum(v.op,5,100,100)/100}!important;`;if(v.ics)r+=`--ics:${dzNum(v.ics,12,120,42)}px;`;if(v.icr!==undefined&&v.icr!=="")r+=`--icr:${dzNum(v.icr,0,50,30)}%;`;if(v.icbg==="transparent")r+=`--icbg:transparent;--icbd:none;--icsh:none;`;else if(okCol(v.icbg))r+=`--icbg:${v.icbg};`;if(v.icx)r+=`--icx:${dzNum(v.icx,-400,400,0)}px;`;if(v.icy)r+=`--icy:${dzNum(v.icy,-400,400,0)}px;`;const tg=(path.match(/([a-z0-9]+):nth-child\(\d+\)$/)||[])[1]||"";const inl=/^(span|b|small|strong|a|i|label|em)$/.test(tg);if(v.w)r+=`width:${dzNum(v.w,8,3000,100)}px!important;max-width:none!important;box-sizing:border-box;${inl?"display:inline-block;":""}`;if(v.h)r+=`height:${dzNum(v.h,8,3000,40)}px!important;${inl&&!v.w?"display:inline-block;":""}${tg==="img"?"object-fit:cover;":""}`;
  if(!r)return;const rule=`body[data-pv="${pv}"] ${path}{${r}}`;if(dev==="m")cm+=rule;else if(dev==="d")cd+=rule;else c+=rule});const simM=cm.replace(/body\[data-pv=/g,"body.sim-mob[data-pv="),simD=cd.replace(/body\[data-pv=/g,"body.sim-desk[data-pv="),dskD=cd.replace(/body\[data-pv=/g,"body:not(.sim-mob)[data-pv="),mobM=cm.replace(/body\[data-pv=/g,"body:not(.sim-desk)[data-pv=");return c+(cm?`@media(max-width:759px){${mobM}}${simM}`:"")+(cd?`@media(min-width:760px){${dskD}}${simD}`:"")}
function feApplyText(){try{const F=design().free||{};const pv=pvKey();const dv=pv+(isMobV()?"@m":"@d");const PT={};Object.entries(F).sort(([a],[b])=>(a.includes("@")?1:0)-(b.includes("@")?1:0)).forEach(([k,v])=>{if(!v)return;const i=k.indexOf("|");const h=k.slice(0,i);if(h!==pv&&h!==dv)return;const p=k.slice(i+1);if(!feOkPath(p))return;const el=document.querySelector(p);if(!el)return;
  if(v.txt!=null&&v.txt!==""&&!el.dataset.feParts){const tn=[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(tn)tn.textContent=v.txt;else if(!el.children.length)el.textContent=v.txt}if(Array.isArray(v.parts)&&v.parts.length)PT[p]={el,parts:v.parts}});Object.values(PT).forEach(o=>feWrapParts(o.el,o.parts));
  if(ui.freeEdit&&ui.feSel){document.querySelectorAll(".fe-on").forEach(x=>x.classList.remove("fe-on"));feSet().forEach(b=>{const e=feElOf(b);if(e)e.classList.add("fe-on")});const el=feElOf(ui.feSel);fePanel(el)}else{const p=document.getElementById("fe-panel");if(p)p.remove()}feBox()}catch(e){}}
function setFree(key,patch){const d=design();const F={...(d.free||{})};const cur={...(F[key]||{}),...patch};Object.keys(cur).forEach(k=>{if((Array.isArray(cur[k])&&!cur[k].length)||cur[k]===""||cur[k]==null||cur[k]===false||(cur[k]===0&&(k==="x"||k==="y")))delete cur[k]});if(Object.keys(cur).length)F[key]=cur;else delete F[key];setDesign({free:F})}

/* تلوين جزء من النص */
function feWrapParts(el,parts){if(!el||!Array.isArray(parts)||!parts.length)return;const sig=JSON.stringify(parts);if(el.dataset.feParts===sig)return;el.dataset.feParts=sig;
  const walk=n=>{const out=[];const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode())if(!t.parentElement.closest(".fe-part"))out.push(t);return out};
  parts.forEach(pt=>{const st=`${okCol(pt.c)?`color:${pt.c};`:""}${pt.fw?`font-weight:${dzNum(pt.fw,300,900,700)};`:""}${pt.fs?`font-size:${dzNum(pt.fs,50,300,100)}%;`:""}${okCol(pt.bg)?`background:${pt.bg};border-radius:4px;padding:0 3px;`:""}`;if(!st)return;
    const re=pt.re==="digits"?/[0-9٠-٩۰-۹]+([.,:\/٫٬][0-9٠-٩۰-۹]+)*/g:null;let done=false;
    walk(el).forEach(t=>{if(done&&!re)return;const s=t.textContent;let m,idx=-1,len=0,ranges=[];
      if(re){re.lastIndex=0;while((m=re.exec(s)))ranges.push([m.index,m[0].length])}else if(pt.s){idx=s.indexOf(pt.s);if(idx>=0){ranges.push([idx,pt.s.length]);done=true}}
      if(!ranges.length)return;const frag=document.createDocumentFragment();let pos=0;ranges.forEach(([a,l])=>{if(a>pos)frag.appendChild(document.createTextNode(s.slice(pos,a)));const sp=document.createElement("span");sp.className="fe-part";sp.setAttribute("style",st);sp.textContent=s.slice(a,a+l);frag.appendChild(sp);pos=a+l});if(pos<s.length)frag.appendChild(document.createTextNode(s.slice(pos)));t.parentNode.replaceChild(frag,t)})})}
/* مقابض تغيير الحجم حول العنصر المحدد */
function feBox(){let b=document.getElementById("fe-box");const el=ui.freeEdit&&ui.feSel?feElOf(ui.feSel):null;if(!el){if(b)b.remove();return}
  if(!b){b=document.createElement("div");b.id="fe-box";b.innerHTML=["nw","n","ne","e","se","s","sw","w"].map(h=>`<i class="fe-h-${h}" data-h="${h}"></i>`).join("")+`<span class="fe-dim"></span>`;document.body.appendChild(b)}
  const r=el.getBoundingClientRect();b.style.left=r.left+"px";b.style.top=r.top+"px";b.style.width=r.width+"px";b.style.height=r.height+"px";b.querySelector(".fe-dim").textContent=Math.round(r.width)+" × "+Math.round(r.height)}
(function(){let rz=null;const raf=()=>requestAnimationFrame(feBox);addEventListener("scroll",raf,true);addEventListener("resize",raf);
document.addEventListener("pointerdown",e=>{const h=e.target.closest&&e.target.closest("#fe-box i");if(!h)return;e.preventDefault();e.stopPropagation();const el=feElOf(ui.feSel);if(!el)return;const r=el.getBoundingClientRect();const v=feVal();
  if(getComputedStyle(el).display==="inline")el.style.display="inline-block";rz={h:h.dataset.h,el,x:e.clientX,y:e.clientY,w0:r.width,h0:r.height,x0:+v.x||0,y0:+v.y||0,z0:+v.zm||1,bw:+v.w||0,bh:+v.h||0};h.setPointerCapture&&h.setPointerCapture(e.pointerId)},true);
document.addEventListener("pointermove",e=>{if(!rz)return;const H=rz.h;const dx=e.clientX-rz.x,dy=e.clientY-rz.y;const el=rz.el;
  if(H.length===2&&!e.altKey){/* الزوايا: تكبير/تصغير العنصر بكل محتواه */
    const sx=(H.includes("w")?rz.w0-dx:rz.w0+dx)/rz.w0,sy=(H.includes("n")?rz.h0-dy:rz.h0+dy)/rz.h0;const s=Math.max(.2,Math.min(6,Math.abs(sx-1)>Math.abs(sy-1)?sx:sy));const z=+(rz.z0*s).toFixed(3);
    rz.cur={zm:z,x:rz.x0,y:rz.y0};el.style.setProperty("zoom",z,"important");el.style.setProperty("transform",`translate(${rz.x0/z}px,${rz.y0/z}px)`,"important");feBox();return}
  let w=rz.w0,h=rz.h0,x=rz.x0,y=rz.y0;const z=rz.z0;
  if(H.includes("e")){w=rz.w0+dx}if(H.includes("w")){w=rz.w0-dx;x=rz.x0+dx}if(H.includes("s")){h=rz.h0+dy}if(H.includes("n")){h=rz.h0-dy;y=rz.y0+dy}
  w=Math.max(12,w);h=Math.max(10,h);rz.cur={w:Math.round(w/z),h:Math.round(h/z),x:Math.round(x),y:Math.round(y)};
  el.style.setProperty("width",rz.cur.w+"px","important");if(H!=="e"&&H!=="w")el.style.setProperty("height",rz.cur.h+"px","important");el.style.setProperty("transform",`translate(${rz.cur.x/z}px,${rz.cur.y/z}px)`,"important");feBox()});
document.addEventListener("pointerup",e=>{if(!rz)return;const R=rz;rz=null;if(!R.cur)return;window.__feDragAt=Date.now();
  if(R.cur.zm!=null){setFreeOne({zm:Math.abs(R.cur.zm-1)<.02?"":R.cur.zm});return}
  const H=R.h;const p={w:R.cur.w,x:R.cur.x,y:R.cur.y};if(H!=="e"&&H!=="w")p.h=R.cur.h;setFreeOne(p)},true);
})();

/* ===== أيقونات تلقائية للعناوين والإحصاءات + حيوية ===== */
const DIC={
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
halaqa:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7" r="1.6"/><circle cx="7.5" cy="14.5" r="1.6"/><circle cx="16.5" cy="14.5" r="1.6"/>',
layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5" opacity=".5"/>',
book:'<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
check:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
award:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
inbox:'<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 14h8M8 17h5"/>',
video:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-4v12l-6-4"/>',
fire:'<path d="M12 22c4 0 7-3 7-7 0-5-4-7-5-11-2 2-3 4-3 6-1-1-2-2-2-4-2 2-4 5-4 9 0 4 3 7 7 7z"/>',
moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
mosque:'<path d="M4 21V12h16v9"/><path d="M8 12c0-3 4-4 4-7 0 3 4 4 4 7"/><path d="M2 21h20M10 21v-4a2 2 0 0 1 4 0v4"/>',
pie:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'};
const DIC_RULES=[[/لوحة الشرف|الأوائل|المتصدر|ترتيب/,"trophy"],[/اختبار|الاختبارات|تقييم|درجة|الدرجات/,"award"],[/حضور|غياب|الحاضر/,"check"],[/موعد|مواعيد|جلس|التسميع|تسميع/,"clock"],[/تقويم|الأسبوع|الشهر|التاريخ|اليوم|جدول/,"cal"],[/المرحلة|المراحل|المستوى|المستويات|المسار/,"layers"],[/حلق/,"halaqa"],[/طالب|طلاب|الطلبة|أبنائي|ابني|الأبناء/,"users"],[/معلم|مشرف|مستخدم|الأعضاء|الفريق|ولي/,"user"],[/رسال|محادث|ملاحظ|تعليق/,"chat"],[/تنبيه|إشعار/,"bell"],[/تقرير|التقارير|إحصاء|مؤشر|نسبة|الأداء|التقدم/,"chart"],[/هدف|الخطة|خطة|المهام|مهام/,"target"],[/تلاوة|التلاوة|صوت|تسجيل صوت/,"mic"],[/مصحف|المصحف|الحفظ|حفظ|مراجعة|المراجعة|سورة|السور|جزء|أجزاء|آية|الورد|ورد/,"book"],[/برنامج|البرامج|دورة|الدورات/,"mosque"],[/طلبات|طلب|الانتظار/,"inbox"],[/صلاحي|الأمان|كلمة المرور/,"lock"],[/إعداد|تخصيص|الأشكال|القوالب/,"gear"],[/ملف|مرفق|تصدير|استيراد/,"file"],[/فيديو|البث|لقاء|اجتماع/,"video"],[/سلسلة|متتالي|نشاط/,"fire"],[/نقاط|نجوم|تميز|إنجاز|إنجازات|المنجزة/,"star"],[/رابط|روابط/,"link"],[/توزيع|نسب/,"pie"],[/تحفيز|تشجيع|دعاء/,"heart"]];
const _dicURL={};function dicURL(k,c){const kk=k+c;return _dicURL[kk]||(_dicURL[kk]=`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${design().icStroke||2}" stroke-linecap="round" stroke-linejoin="round">${DIC[k]}</svg>`)}")`)}
function dicFor(t){t=(t||"").trim();for(const [re,k] of DIC_RULES)if(re.test(t))return k;return ""}
function icCol(){const d=design();if(okCol(d.icColor))return d.icColor;const cs=getComputedStyle(document.documentElement);return (cs.getPropertyValue(d.icStyle==="solid"?"--primary":"--teal")||"#1fa6c6").trim()}
function icFg(){const d=design();return d.icStyle==="solid"?"#ffffff":icCol()}
function icCSS(d){const s=dzNum(d.icSize,20,64,42),r=dzNum(d.icRad,0,50,30),c=okCol(d.icColor)?d.icColor:(d.icStyle==="solid"?"var(--primary)":"var(--teal)");let bg="transparent",bd="none";
  if(d.icStyle==="soft")bg=`color-mix(in srgb,${c} 14%,transparent)`;else if(d.icStyle==="solid")bg=`linear-gradient(135deg,${c},color-mix(in srgb,${c} 55%,var(--teal)))`;else if(d.icStyle==="line")bd=`1.5px solid color-mix(in srgb,${c} 55%,transparent)`;
  const sh=d.icStyle==="solid"?`0 6px 14px color-mix(in srgb,${c} 30%,transparent)`:"none";
  return `:root{--ics:${s}px;--icr:${r}%;--icbg:${bg};--icbd:${bd};--icsh:${sh};--icp:${d.icStyle==="plain"?"0":"19%"}}`}
function decorIcons(){const d=design();const off=d.icons===false||d.icStyle==="off";const fg=off?"":icFg();
  const set=(el,k)=>{if(off||!k||k==="none"){if(el.dataset.ic){el.removeAttribute("data-ic");el.style.removeProperty("--ic")}return}const cc=okCol(el.__icc)?el.__icc:fg;const sig=k+cc;if(el.dataset.ic===sig)return;el.dataset.ic=sig;el.style.setProperty("--ic",k.startsWith("img:")?`url("${(d.icImgs||{})[k.slice(4)]||""}")`:dicURL(k,cc))};
  const F=d.free||{};const pv=pvKey(),dv=feDevKey?feDevKey(pv+"|").split("|")[0]:pv;
  const ov=el=>{const p=fePath(el);if(!p)return null;const a=F[dv+"|"+p],b=F[pv+"|"+p];const o={...(b||{}),...(a||{})};el.__icc=o.icc||"";return o.ic||null};
  if(d.icHead!==false)document.querySelectorAll("main h2, main .card-h h3, main .card > h3:first-child").forEach(h=>set(h,ov(h)||dicFor(h.textContent)||"none"));
  else document.querySelectorAll("main h2[data-ic], main h3[data-ic]").forEach(h=>set(h,ov(h)||"none"));
  document.querySelectorAll("main .stat").forEach(s=>{const l=s.querySelector(":scope > span, :scope > small, :scope > .muted");if(!l||!s.querySelector(":scope > b"))return;set(s,d.icStat===false?(ov(s)||"none"):(ov(s)||dicFor(l.textContent)))})}
let _lastVw="";function vivid(){if(editing()||matchMedia("(prefers-reduced-motion: reduce)").matches||design().motion===false)return;const k=pvKey()+"|"+(ui.asId||"");if(k===_lastVw)return;_lastVw=k;const m=document.querySelector("main");if(!m)return;m.classList.remove("anim-in");void m.offsetWidth;m.classList.add("anim-in");setTimeout(()=>m.classList.remove("anim-in"),1100);
  m.querySelectorAll(".stat > b").forEach(b=>{const t=b.textContent.trim();if(!/^\d{1,5}$/.test(t)||b.dataset.cnt)return;const n=+t;if(n<2)return;b.dataset.cnt=1;const t0=performance.now(),D=700;const st=now=>{const p=Math.min(1,(now-t0)/D);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(st);else delete b.dataset.cnt};requestAnimationFrame(st)})}

/* ===== تراجع / إعادة لكل تعديلات الواجهة ===== */
const UHIST={u:[],r:[],busy:false};
(function(){const _sc=stageConfig;stageConfig=function(id,data){if(id==="ui"&&!UHIST.busy){try{UHIST.u.push(JSON.stringify(uiCfg()));if(UHIST.u.length>60)UHIST.u.shift();UHIST.r=[]}catch(e){}}return _sc(id,data)}})();
function uhDo(dir){const from=dir<0?UHIST.u:UHIST.r,to=dir<0?UHIST.r:UHIST.u;if(!from.length){toast(dir<0?"لا يوجد ما يُتراجع عنه":"لا يوجد ما يُعاد");return}to.push(JSON.stringify(uiCfg()));const v=JSON.parse(from.pop());UHIST.busy=true;try{stageConfig("ui",v)}finally{UHIST.busy=false}}
function uhBtns(){return `<span class="uh"><button type="button" class="btn sm" data-act="uhUndo" title="تراجع (Ctrl+Z)" ${UHIST.u.length?"":"disabled"}>↶</button><button type="button" class="btn sm" data-act="uhRedo" title="إعادة (Ctrl+Y)" ${UHIST.r.length?"":"disabled"}>↷</button></span>`}
document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;let r;try{r=realMe()}catch(_){return}if(!r||!isPA(r))return;const k=e.key.toLowerCase();
  if(k==="z"&&!e.shiftKey){e.preventDefault();uhDo(-1)}else if(k==="y"||(k==="z"&&e.shiftKey)){e.preventDefault();uhDo(1)}});
/* ===== خطوط المحاذاة والمغناطيس أثناء التحريك ===== */
function feSnapInit(d){try{const el=feElOf(ui.feSel);if(!el)return;d.r0=el.getBoundingClientRect();const sel=new Set(d.items.map(o=>o.el));const xs=[],ys=[];
  const m=document.querySelector("main");if(m){const r=m.getBoundingClientRect();xs.push(r.left,r.left+r.width/2,r.right)}
  document.querySelectorAll("main .card,main .stat,main h1,main h2,main h3,main .btn,main .hb,main .pill,main img,main p,main .greet,main .today-card").forEach(x=>{if(sel.has(x)||x.contains(el)||el.contains(x))return;const r=x.getBoundingClientRect();if(!r.width||r.bottom<-200||r.top>innerHeight+200)return;xs.push(r.left,r.left+r.width/2,r.right);ys.push(r.top,r.top+r.height/2,r.bottom)});d.xs=xs;d.ys=ys}catch(e){}}
function feSweep(all){document.querySelectorAll(".fe-guide").forEach(x=>x.remove());if(all){document.querySelectorAll("#fe-mq").forEach(x=>x.remove());document.querySelectorAll(".fe-mq-hit,.fe-hov").forEach(x=>x.classList.remove("fe-mq-hit","fe-hov"))}}
["pointerup","pointercancel"].forEach(t=>document.addEventListener(t,()=>setTimeout(()=>{feSweep(false);document.querySelectorAll("#fe-mq").forEach(x=>{if(!x.isConnected)return;if(!x.dataset.live)x.remove()})},60)));
function feSnap(d,dx,dy){const G=(id,on,pos,vert)=>{let g=document.getElementById(id);if(!on){if(g)g.remove();return}if(!g){g=document.createElement("div");g.id=id;g.className="fe-guide "+(vert?"v":"h");document.body.appendChild(g)}if(vert)g.style.left=pos+"px";else g.style.top=pos+"px"};
  if(!d.r0){return{dx,dy}}const r=d.r0,T=6;let bx=null,by=null;
  [r.left,r.left+r.width/2,r.right].forEach(c=>{d.xs.forEach(X=>{const df=X-(c+dx);if(Math.abs(df)<T&&(!bx||Math.abs(df)<Math.abs(bx.df)))bx={df,X}})});
  [r.top,r.top+r.height/2,r.bottom].forEach(c=>{d.ys.forEach(Y=>{const df=Y-(c+dy);if(Math.abs(df)<T&&(!by||Math.abs(df)<Math.abs(by.df)))by={df,Y}})});
  if(bx)dx+=bx.df;if(by)dy+=by.df;G("fe-gx",!!bx,bx&&bx.X,true);G("fe-gy",!!by,by&&by.Y,false);return{dx,dy}}
function feGuidesOff(){["fe-gx","fe-gy"].forEach(i=>{const g=document.getElementById(i);if(g)g.remove()})}
/* ===== نسخ التصميم المحفوظة + سجل التعديلات ===== */
const UI_KEYN={brand:"الهوية والتصميم",home:"الصفحة الرئيسية",homeM:"رئيسية الجوال",homeD:"رئيسية الكمبيوتر",homeCustom:"المربعات المخصصة",nav:"القائمة العلوية",terms:"المسميات",repl:"استبدال النصوص",lists:"القوائم",snaps:"النسخ المحفوظة"};
function dzSnapsHTML(){const c=uiCfg();const sn=c.snaps||[];const lg=(c.log||[]).slice(-15).reverse();
  return `<div class="card"><div class="card-h"><h2>نسخ التصميم المحفوظة</h2></div><p class="hint">احفظ شكل المنصة الحالي باسم (مثل «رمضان» أو «بداية العام») وارجع له متى ما تبي بضغطة.</p>
  <div class="row" style="gap:8px"><input id="snap-name" placeholder="اسم النسخة، مثل: رمضان" style="flex:1"><button class="btn pri sm" data-act="snapSave">حفظ نسخة</button></div>
  ${sn.length?`<div class="list" style="margin-top:10px">${sn.map((s,i)=>`<div class="li"><div class="grow"><div class="t">${esc(s.n)}</div><div class="small muted">${esc(new Date(s.at).toLocaleString("ar-SA"))}</div></div><button class="btn sm" data-act="snapLoad" data-i="${i}">استرجاع</button><button class="btn sm ghost" data-act="snapDel" data-i="${i}">حذف</button></div>`).join("")}</div>`:`<p class="small muted" style="margin-top:8px">لا توجد نسخ بعد.</p>`}</div>
  <div class="card"><div class="card-h"><h2>سجل التعديلات</h2></div>${lg.length?`<div class="list">${lg.map(x=>`<div class="li"><div class="grow"><div class="t">${esc((x.k||[]).map(k=>UI_KEYN[k]||k).join("، ")||"تعديل")}</div><div class="small muted">${esc(x.by||"")} · ${esc(new Date(x.at).toLocaleString("ar-SA"))}</div></div></div>`).join("")}</div>`:`<p class="small muted">يظهر هنا كل حفظ للتعديلات ومن قام به.</p>`}</div>`}
(function(){const _sd=saveDrafts;saveDrafts=function(){try{if(DRAFT.ui){const old=(S.config.find(x=>x.id==="ui"))||{};const nw=DRAFT.ui;const ks=[...new Set([...Object.keys(old),...Object.keys(nw)])].filter(k=>!["id","log","updated_at","created_at"].includes(k)&&JSON.stringify(old[k])!==JSON.stringify(nw[k]));if(ks.length){let by="";try{by=(realMe()||{}).name||""}catch(e){}DRAFT.ui={...nw,log:[...((nw.log)||[]).slice(-49),{at:Date.now(),by,k:ks}]}}}}catch(e){}return _sd()}})();
/* ===== رسائل جاهزة لولي الأمر ===== */
function parentMsgs(sid){const s=get("members",sid)||{};const n=s.name||"الطالب";let pg=0,st=0;try{pg=totalPages(s)}catch(e){}try{st=streak(sid)}catch(e){}const sn=(cfg&&cfg().name)||"";
  return [["ثناء وتشجيع",`السلام عليكم ورحمة الله وبركاته، نبشّركم بتميّز ${n} في حلقة القرآن الكريم هذا الأسبوع، بارك الله فيه وجعله من أهل القرآن.`],
  ["تحديث عن التقدم",`السلام عليكم ورحمة الله، تحديث عن ${n}: إجمالي المحفوظ ${pg} وجهاً، وانتظامه ${st} يوماً متتالياً. شكراً لمتابعتكم الكريمة.`],
  ["تذكير لطيف",`السلام عليكم، نأمل تشجيع ${n} على مراجعة ورده اليوم؛ فمتابعتكم في البيت لها أثر كبير بإذن الله.`],
  ["افتقدناه اليوم",`السلام عليكم، افتقدنا ${n} اليوم في الحلقة، نرجو أن يكون بخير ونسعد بعودته قريباً.`]]}
function parentMsgModal(sid){const s=get("members",sid)||{};const ph=String(s.guardianPhone||"").replace(/\D/g,"").replace(/^0/,"966");
  openModal("رسائل جاهزة لولي الأمر",`<p class="hint">اختر الرسالة، عدّل عليها إن أردت، ثم انسخها أو أرسلها بالواتساب.</p>${parentMsgs(sid).map(([t,m],i)=>`<div class="pm-item"><b>${esc(t)}</b><textarea id="pm-${i}" rows="3">${esc(m)}</textarea><div class="row" style="gap:6px"><button type="button" class="btn sm" data-act="pmCopy" data-i="${i}">نسخ</button>${ph?`<button type="button" class="btn sm pri" data-act="pmWa" data-i="${i}" data-p="${esc(ph)}">واتساب ولي الأمر</button>`:""}</div></div>`).join("")}`,"pmsg",{},"إغلاق")}
setTimeout(()=>{try{FORMS.pmsg=()=>{closeModal()}}catch(e){}},0);

/* ===================== زادي: مواقيت الصلاة · الأذكار · الأحاديث · أعمالي اليومية ===================== */
const ZAD_API=".netlify/functions/zad";
const ZCITY=[["مكة المكرمة",21.4225,39.8262],["المدينة المنورة",24.4672,39.6111],["الرياض",24.7136,46.6753],["جدة",21.5433,39.1728],["الدمام",26.4207,50.0888],["الخبر",26.2172,50.1971],["الظهران",26.2361,50.0393],["الأحساء",25.3833,49.5833],["الجبيل",27.0046,49.646],["القطيف",26.5652,50.0089],["الطائف",21.2703,40.4158],["أبها",18.2164,42.5053],["خميس مشيط",18.3,42.7333],["تبوك",28.3838,36.555],["بريدة",26.3592,43.9818],["عنيزة",26.0844,43.9935],["حائل",27.5219,41.6907],["جازان",16.8892,42.5511],["نجران",17.4924,44.1277],["ينبع",24.0895,38.0618],["الباحة",20.0129,41.4677],["عرعر",30.9753,41.0381],["سكاكا",29.9697,40.2064],["حفر الباطن",28.4328,45.9708],["القريات",31.3318,37.3428],["الخرج",24.1556,47.3122],["المجمعة",25.9039,45.3456],["الدوادمي",24.5077,44.3924],["القنفذة",19.1264,41.0789],["بيشة",20.0005,42.6052]];
const ZP=[["fajr","الفجر"],["sunrise","الشروق"],["dhuhr","الظهر"],["asr","العصر"],["maghrib","المغرب"],["isha","العشاء"]];
const ZPI={fajr:'<path d="M3 18h18M6 18a6 6 0 0 1 12 0"/><path d="M12 6v3M5 10l1.5 1.5M19 10l-1.5 1.5"/>',sunrise:'<path d="M3 18h18M7 18a5 5 0 0 1 10 0"/><path d="M12 4v4M9 6l3-2 3 2"/>',dhuhr:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',asr:'<circle cx="10" cy="10" r="4"/><path d="M4 20h16M10 2v2M2 10h2M4.3 4.3l1.4 1.4M15.7 4.3l-1.4 1.4"/>',maghrib:'<path d="M3 16h18M7 16a5 5 0 0 1 10 0M5 20h14"/><path d="M12 8v-4M9 6l3 2 3-2"/>',isha:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'};
const zSV=p=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ZST={pt:null,ptKey:"",ptLoad:false,ptSrc:"",idx:null,idxLoad:false,idxErr:false,ch:{},chLoad:{},hq:"",hres:null,hload:false,herr:""};
const zls={get(k,d){try{const v=localStorage.getItem("zad:"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem("zad:"+k,JSON.stringify(v))}catch(e){}}};
const zUid=()=>{try{const m=realMe();return (m&&m.id)||"g"}catch(e){return "g"}};
function zCity(){const i=zls.get("city",null);if(i===-1){const g=zls.get("geo",null);if(g)return [g.n,g.lat,g.lon]}return ZCITY[i==null?2:i]||ZCITY[2]}
function zNear(lat,lon){let b=ZCITY[0],bd=1e9;ZCITY.forEach(c=>{const d=(c[1]-lat)**2+((c[2]-lon)*Math.cos(lat*Math.PI/180))**2;if(d<bd){bd=d;b=c}});return {c:b,km:Math.round(Math.sqrt(bd)*111)}}
function zGeo(auto){ZST.geoAsked=true;if(!("geolocation" in navigator)){if(!auto)toast("المتصفح لا يدعم تحديد الموقع","err");if(zls.get("city",null)==null)zls.set("city",2);return}
  ZST.geoBusy=true;if(!auto)toast("جاري تحديد موقعك…");
  navigator.geolocation.getCurrentPosition(p=>{const lat=+p.coords.latitude.toFixed(4),lon=+p.coords.longitude.toFixed(4);const nr=zNear(lat,lon);zls.set("geo",{n:nr.km<25?nr.c[0]:"موقعي (قرب "+nr.c[0]+")",lat,lon,at:Date.now()});zls.set("city",-1);zls.set("pt",null);ZST.ptKey="";ZST.pt=null;ZST.geoBusy=false;zLoadPT(true);render();toast("حُدّدت المواقيت حسب موقعك ✓")},
   e=>{ZST.geoBusy=false;if(zls.get("city",null)==null)zls.set("city",2);toast(e&&e.code===1?"لم يُسمح بالوصول للموقع — اختر مدينتك من القائمة أو فعّل إذن الموقع للمتصفح":"تعذّر تحديد الموقع، اختر مدينتك من القائمة","err");render()},{enableHighAccuracy:false,timeout:12000,maximumAge:3600000})}
const zYmd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
/* حساب محلي بطريقة تقويم أم القرى (احتياطي عند تعذّر الاتصال) */
function zCalc(date,lat,lng,tz){const R=Math.PI/180,fix=(a,b)=>((a%b)+b)%b;let y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();if(m<=2){y--;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);const jd=Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5-lng/(15*24);
 const sun=t=>{const D=jd+t-2451545;const g=fix(357.529+0.98560028*D,360),q=fix(280.459+0.98564736*D,360);const L=fix(q+1.915*Math.sin(g*R)+0.02*Math.sin(2*g*R),360);const e=23.439-0.00000036*D;const RA=fix(Math.atan2(Math.cos(e*R)*Math.sin(L*R),Math.cos(L*R))/R/15,24);return{decl:Math.asin(Math.sin(e*R)*Math.sin(L*R))/R,eqt:q/15-RA}};
 const mid=t=>fix(12-sun(t).eqt,24);
 const at=(a,t,ccw)=>{const s=sun(t);const v=Math.acos((-Math.sin(a*R)-Math.sin(s.decl*R)*Math.sin(lat*R))/(Math.cos(s.decl*R)*Math.cos(lat*R)))/R/15;return mid(t)+(ccw?-v:v)};
 const asr=t=>{const s=sun(t);const a=-Math.atan(1/(1+Math.tan(Math.abs(lat-s.decl)*R)))/R;return at(a,t)};
 let T={fajr:5,sunrise:6,dhuhr:12,asr:13,maghrib:18};for(let i=0;i<2;i++){const p=x=>x/24;T={fajr:at(18.5,p(T.fajr),true),sunrise:at(0.833,p(T.sunrise),true),dhuhr:mid(p(T.dhuhr)),asr:asr(p(T.asr)),maghrib:at(0.833,p(T.maghrib))}}
 const o={};for(const k in T)o[k]=T[k]+tz-lng/15;let ram=false;try{ram=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",{month:"numeric"}).format(date)==="9"}catch(e){}o.isha=o.maghrib+(ram?2:1.5);
 const f=(h,up)=>{let mm=up?Math.ceil(h*60-0.2):Math.round(h*60);mm=((mm%1440)+1440)%1440;return String(Math.floor(mm/60)).padStart(2,"0")+":"+String(mm%60).padStart(2,"0")};const r={};for(const k in o)r[k]=f(o[k],k==="asr"||k==="maghrib"||k==="isha");return r}
function zHijri(d){try{return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura",{day:"numeric",month:"long",year:"numeric"}).format(d)}catch(e){return""}}
async function zLoadPT(force){const c=zCity(),d=new Date(),key=zYmd(d)+"|"+c[0]+"|"+c[1];if(!force&&ZST.ptKey===key&&ZST.pt)return;const cached=zls.get("pt",null);if(!force&&cached&&cached.key===key){ZST.pt=cached.v;ZST.ptKey=key;ZST.ptSrc=cached.src;return}
  ZST.pt={times:zCalc(d,c[1],c[2],3),hijri:zHijri(d)};ZST.ptKey=key;ZST.ptSrc="calc";if(ZST.ptLoad)return;ZST.ptLoad=true;
  try{const q=new URLSearchParams({t:"umq",yg:d.getFullYear(),mg:d.getMonth()+1,dg:d.getDate(),lat:c[1],lon:c[2],zone:3});const r=await fetch(ZAD_API+"?"+q);if(!r.ok)throw 0;const j=await r.json();const P=j&&j.prayerTimes;if(!P||!P.fajr)throw 0;
    const h=j.hijriDate?`${j.hijriDate.day} ${j.hijriDate.nameAr||j.hijriDate.name} ${j.hijriDate.year} هـ`:zHijri(d);ZST.pt={times:{fajr:P.fajr,sunrise:P.sunrise,dhuhr:P.dhuhr,asr:P.asr,maghrib:P.maghrib,isha:P.isha},hijri:h,season:j.seasons&&j.seasons.starSeasonName};ZST.ptSrc="umq";zls.set("pt",{key,v:ZST.pt,src:"umq"})}catch(e){}
  ZST.ptLoad=false;zRerender()}
function zRerender(){try{if(ui.view==="zad"||!ui.view||["home","today","child"].includes(ui.view))render()}catch(e){}}
const zMin=s=>{const [h,m]=String(s||"0:0").split(":").map(Number);return h*60+m};
const zFmt=s=>{if(!s)return"—";let [h,m]=s.split(":").map(Number);const ap=h<12?"ص":"م";h=h%12||12;return `${h}:${String(m).padStart(2,"0")} <small>${ap}</small>`};
function zNext(){const P=ZST.pt&&ZST.pt.times;if(!P)return null;const now=new Date(),nm=now.getHours()*60+now.getMinutes()+now.getSeconds()/60;const L=["fajr","dhuhr","asr","maghrib","isha"];for(const k of L){const t=zMin(P[k]);if(t>nm)return{k,t,diff:(t-nm)*60}}return{k:"fajr",t:zMin(P.fajr),diff:(zMin(P.fajr)+1440-nm)*60,tom:true}}
function zCur(){const P=ZST.pt&&ZST.pt.times;if(!P)return null;const now=new Date(),nm=now.getHours()*60+now.getMinutes();let c=null;["fajr","dhuhr","asr","maghrib","isha"].forEach(k=>{if(zMin(P[k])<=nm)c=k});return c||"isha"}
const zCD=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return `${h?h+":":""}${String(m).padStart(h?2:1,"0")}:${String(x).padStart(2,"0")}`};
const zName=k=>(ZP.find(x=>x[0]===k)||[,""])[1];
const ZIQ_DEF={fajr:25,dhuhr:20,asr:20,maghrib:10,isha:20};
function zIqOff(k){const o=zls.get("iq",null)||{};return o[k]!=null&&o[k]!==""?+o[k]:ZIQ_DEF[k]}
function zAddMin(s,m){const t=(zMin(s)+m+1440)%1440;return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")}
function zIq(k){const P=ZST.pt&&ZST.pt.times;return P&&P[k]&&ZIQ_DEF[k]!=null?zAddMin(P[k],zIqOff(k)):""}
function zIqWin(){const P=ZST.pt&&ZST.pt.times;if(!P)return null;const now=new Date(),nm=now.getHours()*60+now.getMinutes()+now.getSeconds()/60;for(const k of ["fajr","dhuhr","asr","maghrib","isha"]){const a=zMin(P[k]),q=a+zIqOff(k);if(nm>=a&&nm<q)return{k,secs:(q-nm)*60}}return null}
const zIqTag=k=>{const w=zIqWin();return w?`<small class="zm-iqw">⏳ إقامة ${zName(w.k)} بعد <b class="zad-iqcd">${zCD(w.secs)}</b></small>`:""};
function zSpan(){const P=ZST.pt&&ZST.pt.times;const n=zNext();if(!P||!n)return null;const L=["fajr","dhuhr","asr","maghrib","isha"];const now=new Date(),nm=now.getHours()*60+now.getMinutes()+now.getSeconds()/60;const isha=zMin(P.isha);let nxt,prev,pk;if(n.k==="fajr"){nxt=n.tom?zMin(P.fajr)+1440:zMin(P.fajr);prev=n.tom?isha:isha-1440;pk="isha"}else{nxt=n.t;pk=L[L.indexOf(n.k)-1];prev=zMin(P[pk])}return {pk,prev,nxt,nm}}
function zProg(){const s=zSpan();if(!s)return 0;const pr=s.nxt-s.prev;return pr>0?Math.max(0,Math.min(100,Math.round((s.nm-s.prev)/pr*100))):0}
function zEl(){const s=zSpan();return s?Math.max(0,(s.nm-s.prev)*60):0}
function zPrayMini(){zLoadPT();const n=zNext();const P=ZST.pt&&ZST.pt.times;if(!n||!P)return"";const c=zCity();const cur=zCur();
  return `<div class="zmw"><section class="zad-mini" data-act="go" data-v="zad" role="button" tabindex="0" aria-label="مواقيت الصلاة">
   <svg class="zm-bg" viewBox="0 0 200 60" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g fill="#fff"><rect x="0" y="54" width="200" height="6"/><rect x="70" y="38" width="60" height="18"/><path d="M82 39c0-12 10-16 18-22 8 6 18 10 18 22z"/><rect x="52" y="22" width="5" height="34"/><path d="M51 22l3.5-8 3.5 8z"/><rect x="143" y="22" width="5" height="34"/><path d="M142 22l3.5-8 3.5 8z"/></g></svg>
   <div class="zm-main"><div class="zm-ic">${zSV(ZPI[n.k])}</div><div class="zm-tx"><small>الصلاة القادمة${n.tom?" (غداً)":""} · ${esc(c[0])}</small><b class="zm-n">${zName(n.k)}</b><span class="zm-t">${zFmt(P[n.k])} <em class="zm-iq">· الإقامة ${zFmt(zIq(n.k))}</em></span></div></div>
   <div class="zm-cd"><div class="zm-two"><span><small>مضى منذ ${zName((zSpan()||{}).pk)}</small><b class="zad-el">${zCD(zEl())}</b></span><span><small>متبقٍ لـ${zName(n.k)}</small><b class="zad-cd">${zCD(n.diff)}</b></span></div><i class="zm-bar"><em class="zad-pg" style="width:${zProg()}%"></em></i>${zIqTag()}</div>
   <div class="zm-list">${ZP.filter(x=>x[0]!=="sunrise").map(([k,l])=>`<span class="${k===n.k?"nx":""} ${k===cur&&k!==n.k?"cu":""}"><small>${l}</small><b>${zFmt(P[k])}</b><i>إقامة ${zFmt(zIq(k))}</i></span>`).join("")}</div>
  </section></div>`}
/* ===== الأذان والتنبيه ===== */
let zAudio=null;function zChime(){try{const C=new (window.AudioContext||window.webkitAudioContext)();[[523.25,0],[659.25,.35],[783.99,.7],[1046.5,1.05]].forEach(([f,t])=>{const o=C.createOscillator(),g=C.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0,C.currentTime+t);g.gain.linearRampToValueAtTime(.25,C.currentTime+t+.05);g.gain.exponentialRampToValueAtTime(.001,C.currentTime+t+1.4);o.connect(g);g.connect(C.destination);o.start(C.currentTime+t);o.stop(C.currentTime+t+1.5)})}catch(e){}}
function zAdhan(k){const nm=zName(k);try{if("Notification" in window&&Notification.permission==="granted")new Notification("حان الآن موعد أذان "+nm,{body:"حسب توقيت "+zCity()[0],icon:"icon-192.png",tag:"adhan-"+k})}catch(e){}
  try{toast("حان الآن موعد أذان "+nm+" 🕌")}catch(e){}if(zls.get("sound",true)){try{if(zAudio){zAudio.pause()}zAudio=new Audio("adhan.mp3");zAudio.play().catch(()=>zChime())}catch(e){zChime()}}}
setInterval(()=>{try{document.querySelectorAll(".zad-cd").forEach(el=>{const n=zNext();if(n)el.textContent=zCD(n.diff)});document.querySelectorAll(".zad-pg").forEach(el=>{el.style.width=zProg()+"%"});document.querySelectorAll(".zad-el").forEach(el=>{el.textContent=zCD(zEl())});const iw=zIqWin();document.querySelectorAll(".zad-iqcd").forEach(el=>{if(iw)el.textContent=zCD(iw.secs);else{const p=el.closest(".zm-iqw");if(p)p.remove()}});
  if(!zls.get("adhan",false)||!ZST.pt)return;const now=new Date(),hm=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");const P=ZST.pt.times;["fajr","dhuhr","asr","maghrib","isha"].forEach(k=>{if(P[k]===hm){const f=zYmd(now)+k;if(zls.get("fired","")!==f){zls.set("fired",f);zAdhan(k)}}});
  if(ZST.ptKey&&ZST.ptKey.split("|")[0]!==zYmd(now))zLoadPT(true)}catch(e){}},1000);
/* بطاقة الصلاة في الرئيسية: القادمة + العدّاد + الصلوات الخمس بإقامتها، والضغط يفتح المواقيت */
function zHomeHTML(){if(zls.get("city",null)==null&&!ZST.geoAsked)setTimeout(()=>zGeo(true),300);zLoadPT();const P=ZST.pt&&ZST.pt.times;const n=zNext(),cur=zCur();const c=zCity();const ci=zls.get("city",2);const gg=zls.get("geo",null);
  const now=new Date();const greg=now.toLocaleDateString("ar-SA-u-ca-gregory",{weekday:"long",day:"numeric",month:"short"});const city=ci===-1&&gg?gg.n:(c&&c[0])||"";
  return `<section class="zad-hero zh-home" data-act="zadHome" role="button" tabindex="0" aria-label="مواقيت الصلاة — اضغط لعرض التفاصيل">${n&&P?`
   <div class="zhh-top"><span class="zh-ic">${zSV(ZPI[n.k])}</span><div class="zhh-n"><small>الصلاة القادمة${n.tom?" (غداً)":""}</small><h2>${zName(n.k)}</h2><div class="zh-time">${zFmt(P[n.k])} <span class="zh-iq">· الإقامة ${zFmt(zIq(n.k))}</span></div></div>
    <div class="zhh-side"><span class="zhh-city">${zSV('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>')}${esc(city)}</span><b>${esc((ZST.pt&&ZST.pt.hijri)||zHijri(now))}</b><small>${esc(greg)}</small></div></div>
   <div class="zhh-tm"><div class="zhh-cd"><span class="rem"><small>متبقٍ لـ${zName(n.k)}</small><b class="zad-cd">${zCD(n.diff)}</b></span><i class="sep"></i><span><small>مضى منذ ${zName((zSpan()||{}).pk)}</small><b class="zad-el">${zCD(zEl())}</b></span></div><i class="zm-bar"><em class="zad-pg" style="width:${zProg()}%"></em></i></div>
   <div class="zhh-list">${(()=>{const L=ZP.filter(x=>x[0]!=="sunrise");const ni=L.findIndex(x=>x[0]===n.k);return L.map(([k,l],i)=>`<span class="${k===n.k?"nx":""} ${!n.tom&&i<ni?"past":""}"><i class="pi">${zSV(ZPI[k])}</i><small>${l}</small><b>${zFmt(P[k])}</b><em>إقامة ${zFmt(zIq(k))}</em></span>`).join("")})()}</div>`:`<p>جاري تحميل المواقيت…</p>`}</section>`}
function zHeroHTML(){if(zls.get("city",null)==null&&!ZST.geoAsked)setTimeout(()=>zGeo(true),300);zLoadPT();const c=zCity(),P=ZST.pt&&ZST.pt.times;const n=zNext(),cur=zCur();const ci=zls.get("city",2);const gg=zls.get("geo",null);const adh=zls.get("adhan",false),snd=zls.get("sound",true);
  const now=new Date();const greg=now.toLocaleDateString("ar-SA-u-ca-gregory",{weekday:"long",day:"numeric",month:"short"});
  return `<section class="zad-hero">
   ${n&&P?`<div class="zh-next"><span class="zh-ic">${zSV(ZPI[n.k])}</span><div><small>الصلاة القادمة${n.tom?" (غداً)":""}</small><h2>${zName(n.k)}</h2><div class="zh-time">${zFmt(P[n.k])} <span class="zh-iq">· الإقامة ${zFmt(zIq(n.k))}</span></div></div><div class="zh-side"><label class="zh-city zh-city2">${zSV('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>')}<select data-change="zadCity" aria-label="المدينة"><option value="-1" ${ci===-1?"selected":""}>📍 ${ci===-1&&gg?esc(gg.n):"موقعي الحالي (تلقائي)"}</option>${ZCITY.map((x,i)=>`<option value="${i}" ${i===ci?"selected":""}>${esc(x[0])}</option>`).join("")}</select></label><b>${esc((ZST.pt&&ZST.pt.hijri)||zHijri(now))}</b><small>${esc(greg)}</small></div><div class="zh-cd"><div class="zm-two"><span><small>مضى منذ ${zName((zSpan()||{}).pk)}</small><b class="zad-el">${zCD(zEl())}</b></span><span><small>متبقٍ</small><b class="zad-cd">${zCD(n.diff)}</b></span></div><i class="zm-bar"><em class="zad-pg" style="width:${zProg()}%"></em></i>${zIqTag()}</div></div>`:`<p>جاري تحميل المواقيت…</p>`}</section>`}
function zPrayTab(){if(zls.get("city",null)==null&&!ZST.geoAsked)setTimeout(()=>zGeo(true),300);zLoadPT();const c=zCity(),P=ZST.pt&&ZST.pt.times;const n=zNext(),cur=zCur();const ci=zls.get("city",2);const gg=zls.get("geo",null);const adh=zls.get("adhan",false),snd=zls.get("sound",true);
  const now=new Date();const greg=now.toLocaleDateString("ar-SA-u-ca-gregory",{weekday:"long",day:"numeric",month:"short"});
  return `<div class="zhw zhw-tab">${zHeroHTML()}</div>`+`
  <div class="zad-times">${P?ZP.map(([k,l])=>`<div class="zt ${n&&n.k===k?"next":""} ${cur===k&&!(n&&n.k===k)?"cur":""} ${k==="sunrise"?"sun":""}"><span class="zt-ic">${zSV(ZPI[k])}</span><span class="zt-n">${l}</span><b class="zt-t">${zFmt(P[k])}</b>${zIq(k)?`<em class="zt-iq">الإقامة ${zFmt(zIq(k))}</em>`:""}${n&&n.k===k?`<i class="zt-tag">القادمة</i>`:""}</div>`).join(""):""}</div>
  <div class="card zad-set"><div class="zs-row"><div><b>تنبيه الأذان</b><small class="muted">تنبيه وصوت عند دخول وقت كل صلاة أثناء فتح المنصة</small></div><label class="zsw"><input type="checkbox" data-change="zadAdhan" ${adh?"checked":""}><i></i></label></div>
   <div class="zs-row"><div><b>صوت الأذان</b><small class="muted">يشغّل ملف الأذان إن وُجد، وإلا نغمة تنبيه لطيفة</small></div><label class="zsw"><input type="checkbox" data-change="zadSound" ${snd?"checked":""}><i></i></label></div>
   <div class="zs-row" style="display:block"><b>مدة الإقامة بعد الأذان (بالدقائق)</b><div class="zs-iq">${["fajr","dhuhr","asr","maghrib","isha"].map(k=>`<label><small>${zName(k)}</small><input type="number" min="0" max="60" value="${zIqOff(k)}" data-change="zadIq" data-k="${k}"></label>`).join("")}</div><small class="muted">الافتراضي حسب تقويم وزارة الشؤون الإسلامية: الفجر ٢٥، المغرب ١٠، وبقية الصلوات ٢٠ دقيقة. عدّلها حسب مسجدك.</small></div>
   <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm pri" data-act="zadGeo">📍 ${ZST.geoBusy?"جاري التحديد…":"حدّد موقعي تلقائياً"}</button><button class="btn sm" data-act="zadTest">تجربة التنبيه</button><button class="btn sm ghost" data-act="zadRefresh">تحديث المواقيت</button></div>
   <p class="small muted" style="margin-top:8px">${ZST.ptSrc==="umq"?`المصدر: <a href="https://www.ummulqura.org.sa/ar/prayer-times" target="_blank" rel="noopener">تقويم أم القرى</a> (مدينة الملك عبدالعزيز للعلوم والتقنية)`:"تُحسب المواقيت بطريقة تقويم أم القرى إلى حين الاتصال بالمصدر الرسمي."}${ZST.pt&&ZST.pt.season?` · ${esc(ZST.pt.season)}`:""}</p></div>`}
/* ===== الأذكار (حصن المسلم) ===== */
const ZCATS=[["الصباح والمساء",/الصباح|المساء/],["النوم والاستيقاظ",/النوم|الاستيقاظ|تقلب|الفزع في|الرؤيا|الحلم|الأرق/],["الصلاة والطهارة",/الصلاة|الوضوء|الخلاء|الركوع|السجود|التشهد|الاستفتاح|القنوت|الوتر|التلاوة|الاستخارة|الجلسة|الرفع من|السلام من/],["المسجد والأذان",/المسجد|الأذان/],["المنزل واللباس",/المنزل|الثوب|اللباس|لبس/],["الطعام والصيام",/الطعام|الأكل|الصائم|الإفطار|أفطر|الشراب|سقى|الضيف|اللبن/],["السفر والطريق",/السفر|المسافر|الركوب|السوق|القرية|البلدة|الدابة|نزل منزلا|الرجوع|المقيم/],["الهم والكرب والمرض",/الهم|الحزن|الكرب|المصيبة|المريض|المرض|الوجع|الغضب|الخوف|العدو|الدين|الوسوسة|الشك|الموت|الميت|التعزية|القبر|المحتضر|السلطان|يكره|يفزع|أصابه|ما لا يرضاه|الذنب|العين/],["المطر والأحوال",/المطر|الريح|الرعد|الهلال|الاستسقاء|الاستصحاء|الغيم|الديك|الحمار|الكلب/],["المناسبات والتعامل",/الزواج|المولود|العطاس|التهنئة|السلام|الزوج|التحنيك|مدح|الكافر|المجلس|كفارة|الحج|العمرة|الصفا|التلبية|الحجر الأسود|الركن|عرفة|المشعر|الجمار|الأضحية|الذبح|معروف|البيع|التعجب|السرور|الأمر|للصبيان|لقي/],["التسبيح والاستغفار",/التسبيح|التحميد|التهليل|التكبير|الاستغفار|التوبة|الصلاة على النبي|فضل/]];
const zCatOf=t=>{for(const [n,re] of ZCATS)if(re.test(t))return n;return "أدعية متنوعة"};
async function zHisn(id){const direct="https://www.hisnmuslim.com/api/ar/"+(id==="index"?"husn_ar":id)+".json";for(const u of [direct,ZAD_API+"?t=hisn&id="+id]){try{const r=await fetch(u);if(r.ok){const t=await r.text();return JSON.parse(t.replace(/^\uFEFF/,""))}}catch(e){}}throw new Error("hisn")}
async function zLoadIdx(force){if(ZST.idx||ZST.idxLoad||(ZST.idxErr&&!force))return;ZST.idxErr=false;const c=zls.get("hisnIdx",null);if(c&&c.length){ZST.idx=c;return}ZST.idxLoad=true;try{const j=await zHisn("index");const L=(Object.values(j)[0]||[]).map(x=>({id:x.ID,t:String(x.TITLE||"").trim()})).filter(x=>x.id&&x.t);if(!L.length)throw 0;ZST.idx=L;zls.set("hisnIdx",L)}catch(e){ZST.idxErr=true}ZST.idxLoad=false;zRerender()}
async function zLoadCh(id){if(ZST.ch[id]||ZST.chLoad[id])return;const c=zls.get("hisn:"+id,null);if(c){ZST.ch[id]=c;return}ZST.chLoad[id]=true;try{const j=await zHisn(id);const L=(Object.values(j)[0]||[]).map(x=>({id:x.ID,t:String(x.ARABIC_TEXT||"").trim(),n:Math.max(1,Number(x.REPEAT)||1)})).filter(x=>x.t);ZST.ch[id]=L;zls.set("hisn:"+id,L)}catch(e){ZST.ch[id]="err"}ZST.chLoad[id]=false;zRerender()}
/* توحيد الذكر المكرر: يُكتب مرة واحدة ويُنقل التكرار إلى عدّاد الضغط */
const ZNUM={"مرة":1,"مرتين":2,"مرتان":2,"ثلاث":3,"ثلاثا":3,"ثلاثاً":3,"ثلاثًا":3,"أربع":4,"خمس":5,"ست":6,"سبع":7,"سبعا":7,"سبعاً":7,"عشر":10,"عشرا":10,"عشراً":10,"مائة":100,"مئة":100};
/* الذكر القرآني (آية الكرسي، خواتيم البقرة، المعوذات، «حسبي الله…») يُعرض بخط مصحف الملك فهد */
const ZQV=[[2,255],[2,285],[2,286],[112,1],[112,2],[112,3],[112,4],[113,1],[113,2],[113,3],[113,4],[113,5],[114,1],[114,2],[114,3],[114,4],[114,5],[114,6],[9,129],[3,8],[23,97],[23,98],[21,87],[2,201],[25,74],[3,26],[3,27],[59,22],[59,23],[59,24]];
const zQn=t=>String(t||"").replace(/[ٱأإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/[^\u0621-\u064A\s]/g,"").replace(/[ءـ]/g,"").replace(/\s+/g," ").trim();
const ZQC={};function zIsQ(t){if(!t)return false;if(ZQC[t]!=null)return ZQC[t];if(/﴿/.test(t))return ZQC[t]=true;if(typeof Q==="undefined"||!Q||!Q.v)return false;
  const W=new Set(zQn(t).split(" ").filter(w=>w.length>2));if(W.size<3)return ZQC[t]=false;let hit=0;
  for(const[sn,a]of ZQV){const g=Q.ss[sn-1]+a-1;const vw=zQn(Q.v[g]).split(" ").filter(w=>w.length>2);if(vw.length<2)continue;const inn=vw.filter(w=>W.has(w)).length;if(inn/vw.length>=.7||inn>=12)hit+=inn}
  return ZQC[t]=hit>=Math.max(3,W.size*.45)}
function zDkFix(x){if(!x||!x.t)return x;let t=String(x.t).replace(/\s+/g," ").trim(),n=x.n||1;
  const toN=w=>{w=String(w).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).trim();if(/^\d+$/.test(w))return +w;return ZNUM[w]||ZNUM[w.replace(/[ًٌٍَُِّْ]/g,"")]||0};
  const m=t.match(/[\(\[«]?\s*((?:\d+|[٠-٩]+|مرة|مرتين|مرتان|ثلاث|ثلاثاً|ثلاثًا|ثلاثا|أربع|خمس|ست|سبع|سبعاً|سبعا|عشر|عشراً|عشرا|مائة|مئة))\s*(?:مرات|مرة|مرّات)?\s*[\)\]»]?\s*[\.۔]?\s*$/);
  if(m&&m.index>t.length*.3){const k=toN(m[1]);if(k>1&&(/مر|ثلاث|سبع|عشر|مائة|مئة|مرتين/.test(m[0]))){n=Math.max(n,k);t=t.slice(0,m.index).replace(/[\s\.،,:-]+$/,"").trim()}}
  try{const re=/^(.{12,}?)(?:[\s\.،,؛:۔-]*\1)+[\s\.،۔]*$/s;const mm=t.match(re);if(mm){const seg=mm[1].replace(/[\s\.،,؛:-]+$/,"").trim();const k=Math.round(t.replace(/[\s\.،,؛:۔-]/g,"").length/seg.replace(/[\s\.،,؛:۔-]/g,"").length);if(k>1){t=seg;n=Math.max(n,k)}}}catch(e){}
  return {...x,t,n}}
/* ===== فضل الأذكار (أحاديث صحيحة/حسنة مع مصادرها) ===== */
const zAr=t=>String(t||"").replace(/[ً-ٰٟـ]/g,"").replace(/[إأآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^ء-ي\s]/g," ").replace(/\s+/g," ").trim();
const ZFADL=[{"k": ["سبحان الله والحمد لله والله اكبر"], "v": [{"n": 33, "t": "تُغفر خطاياه وإن كانت مثل زبد البحر", "h": "مَن سَبَّحَ اللهَ في دُبُرِ كُلِّ صَلاةٍ ثَلاثًا وثَلاثينَ، وحَمِدَ اللهَ ثَلاثًا وثَلاثينَ، وكَبَّرَ اللهَ ثَلاثًا وثَلاثينَ، فتلك تِسعةٌ وتِسعونَ، وقال تَمامَ المِئةِ: لا إلَهَ إلَّا اللهُ وحدَه لا شَريكَ له، له المُلكُ وله الحَمدُ وهو على كُلِّ شيءٍ قديرٌ، غُفِرَت خَطاياه وإن كانَت مِثلَ زَبَدِ البَحرِ.", "d": {"ra": "أبو هريرة", "mu": "مسلم", "src": "صحيح مسلم", "no": "597"}}]}, {"k": ["اللهم انت ربي لا اله الا انت خلقتني"], "v": [{"t": "سيد الاستغفار: من قاله موقنًا فمات من يومه أو ليلته فهو من أهل الجنة", "h": "سَيِّدُ الاستِغفارِ أن تَقولَ: اللهُمَّ أنتَ رَبِّي لا إلَهَ إلَّا أنتَ، خَلَقتَني وأنا عَبدُك، وأنا على عَهدِك ووَعدِك ما استَطَعتُ، أعوذُ بك مِن شَرِّ ما صَنَعتُ، أبوءُ لك بنِعمَتِك عَلَيَّ، وأبوءُ لك بذَنبي، فاغفِرْ لي؛ فإنَّه لا يَغفِرُ الذُّنوبَ إلَّا أنتَ. قال: ومَن قالها مِنَ النَّهارِ موقِنًا بها، فماتَ مِن يَومِه قَبلَ أن يُمسيَ، فهو مِن أهلِ الجَنَّةِ، ومَن قالها مِنَ اللَّيلِ وهو موقِنٌ بها، فماتَ قَبلَ أن يُصبِحَ، فهو مِن أهلِ الجَنَّةِ.", "d": {"ra": "شداد بن أوس", "mu": "البخاري", "src": "صحيح البخاري", "no": "6306"}}]}, {"k": ["الله لا اله الا هو الحي القيوم لا تاخذه"], "v": [{"t": "عند النوم: حفظ من الله حتى الصباح", "h": "… إذا أَوَيتَ إلى فراشِك، فاقرأ آيةَ الكرسيِّ : ( اللهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ) حتى تختم الآيةَ، فإنك لن يزال عليك من الله حافظٌ، ولا يقربُك شيطانٌ حتى تصبحَ …", "d": {"ra": "أبو هريرة", "mu": "الألباني", "src": "صحيح الترغيب", "no": "610"}}, {"t": "دبر كل صلاة: لم يمنعه من دخول الجنة إلا أن يموت", "h": "مَن قَرأَ آيةَ الكرسيِّ دُبَرَ كُلِّ صلاةٍ؛ لَم يَمنعْه مِن دخولِ الجنَّةِ إلَّا أن يَموتَ.", "d": {"ra": "أبو أمامة الباهلي", "mu": "الألباني", "src": "صحيح الترغيب", "no": "1595"}}]}, {"k": ["امن الرسول بما انزل اليه من ربه"], "v": [{"t": "تكفيان قارئهما ليلته", "h": "مَن قَرَأ بالآيَتَينِ مِن آخِرِ سورةِ البَقَرةِ في لَيلةٍ كَفَتاه.", "d": {"ra": "أبو مسعود عقبة بن عمرو", "mu": "البخاري", "src": "صحيح البخاري", "no": "5009"}}]}, {"k": ["سبحان الله وبحمده عدد خلقه"], "v": [{"n": 3, "t": "أربع كلمات لو وُزنت بذكر طويل لوزنته", "h": "… لقد قُلتُ بَعدَكِ أربَعَ كَلِماتٍ ثَلاثَ مَرَّاتٍ، لو وُزِنَت بما قُلتِ مُنذُ اليَومِ لَوزَنَتهُنَّ: سُبحانَ اللهِ وبحَمدِه، عَدَدَ خَلقِه، ورِضا نَفسِه، وزِنةَ عَرشِه، ومِدادَ كَلِماتِه.", "d": {"ra": "جويرية بنت الحارث أم المؤمنين", "mu": "مسلم", "src": "صحيح مسلم", "no": "2726"}}]}, {"k": ["سبحان الله وبحمده سبحان الله العظيم"], "v": [{"t": "ثقيلتان في الميزان، حبيبتان إلى الرحمن", "h": "كَلِمَتانِ خَفيفَتانِ على اللِّسانِ، ثَقيلَتانِ في الميزانِ، حَبيبَتانِ إلى الرَّحمَنِ: سُبحانَ اللهِ وبحَمدِه، سُبحانَ اللهِ العَظيمِ.", "d": {"ra": "أبو هريرة", "mu": "البخاري", "src": "صحيح البخاري", "no": "6682"}}]}, {"k": ["لا اله الا الله وحده لا شريك له له الملك وله الحمد وهو علي كل شيء قدير"], "v": [{"n": 1, "t": "في الصباح: عدل رقبة، وعشر حسنات، ومحو عشر سيئات، ورفع عشر درجات، وحرز من الشيطان حتى المساء", "h": "من قال إذا أصبح : لا إله إلا اللهُ وحده لا شريك له، له الملكُ وله الحمدُ، وهو على كلِّ شيءٍ قديرٌ، كان له عِدلُ رقبةٍ، من ولد إسماعيلَ، وكُتِبَتْ له بها عشرُ حسناتٍ، وحَطَّ عنه بها عشرَ سيِّئاتٍ، ورَفع له بها عشرَ درجاتٍ، وكان في حِرْزٍ من الشيطانِ حتى يُمسيَ، وإذا قالها إذا أمسى كان له مثلُ ذلك حتى يُصبِحَ", "d": {"ra": "أبو عياش الزرقي", "mu": "الألباني", "src": "صحيح الجامع", "no": "6418"}}, {"n": 10, "t": "كمن أعتق أربعة أنفس من ولد إسماعيل", "h": "مَن قال: لا إلَهَ إلَّا اللهُ وحدَه لا شَريكَ له، له المُلكُ ولَه الحَمدُ وهو على كُلِّ شيءٍ قديرٌ، عَشرَ مِرارٍ، كان كَمَن أعتَقَ أربَعةَ أنفُسٍ مِن ولَدِ إسماعيلَ.", "d": {"ra": "أبو أيوب الأنصاري", "mu": "مسلم", "src": "صحيح مسلم", "no": "2693"}}, {"n": 100, "t": "عدل عشر رقاب، ومائة حسنة، ومحو مائة سيئة، وحرز من الشيطان يومه كله", "h": "مَن قال: لا إلَهَ إلَّا اللهُ وحدَه لا شَريكَ له، له المُلكُ وله الحَمدُ، وهو على كُلِّ شيءٍ قديرٌ، في يَومٍ مِائةَ مَرَّةٍ؛ كانَت له عَدلَ عَشرِ رِقابٍ، وكُتِبَت له مِائةُ حَسَنةٍ، ومُحيَت عنه مِائةُ سَيِّئةٍ، وكانَت له حِرزًا مِنَ الشَّيطانِ يَومَه ذلك حتَّى يُمسيَ، ولم يَأتِ أحَدٌ أفضَلَ ممَّا جاءَ به، إلَّا أحَدٌ عَمِلَ أكثَرَ مِن ذلك …", "d": {"ra": "أبو هريرة", "mu": "مسلم", "src": "صحيح مسلم", "no": "2691"}}]}, {"k": ["سبحان الله وبحمده"], "max": 40, "v": [{"n": 100, "t": "تُحطّ خطاياه وإن كانت مثل زبد البحر", "h": "مَن قال: سُبحانَ اللهِ وبحَمدِه، في يَومٍ مِائةَ مَرَّةٍ، حُطَّت خَطاياه وإن كانَت مِثلَ زَبَدِ البَحرِ.", "d": {"ra": "أبو هريرة", "mu": "البخاري", "src": "صحيح البخاري", "no": "6405"}}]}, {"k": ["بسم الله الذي لا يضر مع اسمه شيء"], "v": [{"n": 3, "t": "لا يضره شيء", "h": "ما من عبدٍ يقولُ في صباحِ كلِّ يومٍ ومساءِ كلِّ ليلةٍ بسمِ اللهِ الذي لا يضرُّ مع اسمِه شيءٌ في الأرضِ ولا في السماءِ وهو السميعُ العليمُ ثلاثَ مراتٍ فيضرُّه شيءٌ", "d": {"ra": "عثمان بن عفان", "mu": "الألباني", "src": "صحيح ابن ماجه", "no": "3134"}}]}, {"k": ["اعوذ بكلمات الله التامات من شر ما خلق"], "v": [{"t": "في المساء: لا تضره", "h": "أمَا إنَّكَ لَوْ قُلتَ حِينَ أمْسيْتَ : أعوذُ بِكلِماتِ اللهِ التَّامَّاتِ من شَرِّ ما خلق؛ لَمْ تَضُرَّكَ", "d": {"ra": "أبو هريرة", "mu": "الألباني", "src": "صحيح الجامع", "no": "1318"}}, {"t": "عند نزول أي مكان: لا يضره شيء حتى يرتحل", "h": "مَن نَزَلَ مَنزِلًا ثُمَّ قال: أعوذُ بكَلِماتِ اللهِ التَّامَّاتِ مِن شَرِّ ما خَلَقَ، لم يَضُرَّه شَيءٌ حتَّى يَرتَحِلَ مِن مَنزِلِه ذلك.", "d": {"ra": "خولة بنت حكيم", "mu": "مسلم", "src": "صحيح مسلم", "no": "2708"}}]}, {"k": ["قل هو الله احد", "قل اعوذ برب الفلق", "قل اعوذ برب الناس"], "v": [{"n": 3, "t": "تكفيك من كل شيء", "h": "قُلْ هو اللَّهُ أحَدٌ و المعوذتينِ حين تُمسي، و حين تُصبحُ، ثلاثَ مراتٍ تكفيك من كلِّ شيءٍ", "d": {"ra": "عبدالله بن خبيب", "mu": "الألباني", "src": "صحيح الجامع", "no": "4406"}}]}, {"k": ["بسم الله توكلت علي الله"], "v": [{"t": "هُديت وكُفيت ووُقيت، وتتنحى عنه الشياطين", "h": "إذا خرج الرجلُ من بيتِهِ فقال : بِسْمِ اللهِ، توكلتُ على اللهِ، لا حولَ ولا قوةَ إلا باللهِ. قال : يُقالُ حِينَئِذٍ : هُدِيتَ وكُفِيتَ ووُقِيتَ، فتَتَنَحَّى له الشياطينُ، فيقولُ شيطانٌ آخَرُ : كيف لك برجلٍ قد هُدِيَ وكُفِيَ ووُقِيَ ؟", "d": {"ra": "أنس بن مالك", "mu": "الألباني", "src": "صحيح أبي داود", "no": "5095"}}]}, {"k": ["لا حول ولا قوه الا بالله"], "max": 30, "v": [{"t": "كنز من كنوز الجنة", "h": "ألا أدُلُّكَ على كَلِمةٍ مِن كُنوزِ الجَنَّةِ، أو قال: على كَنزٍ مِن كُنوزِ الجَنَّةِ؟ فقُلتُ: بَلى، فقال: لا حَولَ ولا قوَّةَ إلَّا باللهِ.", "d": {"ra": "أبو موسى الأشعري", "mu": "مسلم", "src": "صحيح مسلم", "no": "2704"}}]}, {"k": ["اللهم صل علي محمد"], "v": [{"t": "يصلي الله عليك بها عشرًا", "h": "… فإنَّه مَن صَلَّى عليَّ صَلاةً صَلَّى اللهُ عليه بها عَشرًا …", "d": {"ra": "عبدالله بن عمرو", "mu": "مسلم", "src": "صحيح مسلم", "no": "384"}}]}, {"k": ["استغفر الله"], "max": 40, "v": [{"n": 100, "t": "هدي النبي ﷺ: التوبة كل يوم مائة مرة", "h": "يا أيُّها النَّاسُ توبوا إلى اللهِ؛ فإنِّي أتوبُ في اليَومِ إليه مِئةَ مَرَّةٍ.", "d": {"ra": "الأغر المزني أبو مالك", "mu": "مسلم", "src": "صحيح مسلم", "no": "2702"}}]}].map(e=>({...e,kn:e.k.map(zAr)}));
function zFadlOf(t){const n=zAr(t);for(const e of ZFADL){if(e.max&&n.length>e.max)continue;if(e.kn.some(k=>n.includes(k)))return e}return null}
function zFadlModal(id){const L0=ZST.ch[ui.zch];if(!Array.isArray(L0))return;const x=L0.map(zDkFix).find(y=>String(y.id)===String(id));if(!x)return;const e=zFadlOf(x.t);if(!e)return;const AR=n=>AR_D?AR_D(n):n;
  openModal("فضل الذكر",`<p class="fz-dk ${zIsQ(x.t)?"dk-q":""}">${esc(x.t.length>180?x.t.slice(0,180)+"…":x.t)}</p>${e.v.map(v=>`<section class="fz-it">${v.n?`<span class="fz-n">${AR(v.n)} ${v.n===1?"مرة":v.n<11?"مرات":"مرة"}</span>`:""}<b>${esc(v.t)}</b><blockquote>${esc(v.h)}</blockquote><div class="fz-src"><span><b>الراوي:</b> ${esc(v.d.ra)}</span><span><b>المحدث:</b> ${esc(v.d.mu)}</span><span><b>المصدر:</b> ${esc(v.d.src)} (${esc(v.d.no)})</span><span class="fz-ok">الحكم: صحيح</span></div><a class="fz-link" href="https://dorar.net/hadith/search?q=${encodeURIComponent(v.h.replace(/^…\s*/,"").replace(/[\u064B-\u0652]/g,"").split(/\s+/).slice(0,8).join(" "))}" target="_blank" rel="noopener">عرض الحديث في الدرر السنية ↗</a></section>`).join("")}<p class="hint">الأحاديث من الموسوعة الحديثية في <b>الدرر السنية</b>، ولا نعرض إلا ما حُكم عليه بالصحة.</p>`,"noop",{},"إغلاق")}
const ZQUICK=[[27,"الصباح والمساء"],[28,"النوم"],[1,"الاستيقاظ"],[25,"بعد السلام من الصلاة"]];
function zAdhkarTab(){zLoadIdx();const cid=ui.zch;
  if(cid){zLoadCh(cid);const L0=ZST.ch[cid];const DKN=zls.get("dkn",{});const L=Array.isArray(L0)?L0.map(zDkFix).map(x=>{const e=zFadlOf(x.t);const ns=e?[...new Set(e.v.map(v=>v.n).filter(Boolean))]:[];const ch=DKN[x.id];return {...x,fz:!!e,ns:ns.length>1?ns:null,n:ns.length>1&&ch&&ns.includes(ch)?ch:(ns.length>1&&!ns.includes(x.n)?ns[0]:x.n)}}).reduce((o,x)=>{const p=o[o.length-1];if(p&&p.t===x.t){p.n+=x.n}else o.push({...x});return o},[]):L0;const meta=(ZST.idx||[]).find(x=>x.id==cid)||{t:(ZQUICK.find(x=>x[0]==cid)||[,""])[1]};const cnt=zls.get("cnt:"+zYmd(new Date()),{});const done=Array.isArray(L)?L.filter(x=>(cnt[x.id]||0)>=x.n).length:0;
    return `<div class="zad-bar"><button class="btn sm" data-act="zadBack">→ رجوع</button><h2 class="zad-h">${esc(meta.t||"")}</h2>${Array.isArray(L)?`<span class="pill ${done===L.length?"p-ok":""}">${done}/${L.length}</span><button class="btn sm ghost" data-act="zadCntReset" data-id="${cid}">تصفير</button>`:""}</div>
    ${L==="err"?`<div class="empty">تعذّر جلب الأذكار الآن. <a href="https://hisnmuslim.com/i/ar/${esc(String(cid))}" target="_blank" rel="noopener">افتحها في حصن المسلم ↗</a></div>`:!L?`<div class="empty">جاري التحميل…</div>`:`<div class="zad-dk">${L.map(x=>{const c=Math.min(cnt[x.id]||0,x.n);const ok=c>=x.n;return `<article class="dk ${ok?"ok":""}"><p class="dk-t ${zIsQ(x.t)?"dk-q":""}">${esc(x.t)}</p><div class="dk-f"><button class="dk-btn" data-act="zadTap" data-id="${x.id}" data-n="${x.n}" aria-label="عدّ"><span class="dk-ring" style="--p:${Math.round(c/x.n*100)}"></span><b>${ok?"✓":c}</b><small>/${x.n}</small></button><span class="small muted">${x.n>1?`يُكرر ${x.n} ${x.n<11?"مرات":"مرة"}`:"مرة واحدة"} · اضغط الدائرة للعدّ</span>${x.fz?`<button class="dk-fz" data-act="zadFadl" data-id="${x.id}">✦ فضل الذكر</button>`:""}</div>${x.ns?`<div class="dk-ns"><span class="small muted">العدد:</span>${x.ns.map(k=>`<button class="${k===x.n?"on":""}" data-act="zadDkN" data-id="${x.id}" data-v="${k}">${AR_D(k)} ${k===1?"مرة":k<11?"مرات":"مرة"}</button>`).join("")}</div>`:""}</article>`}).join("")}</div><p class="small muted">المصدر: <a href="https://hisnmuslim.com/i/ar/${esc(String(cid))}" target="_blank" rel="noopener">حصن المسلم</a></p>`}`}
  const cat=ui.zcat||"";const q=(ui.zq||"").trim();const I=ZST.idx||[];const groups={};I.forEach(x=>{const g=zCatOf(x.t);(groups[g]=groups[g]||[]).push(x)});const names=[...ZCATS.map(x=>x[0]),"أدعية متنوعة"].filter(n=>groups[n]);
  let list=I;if(cat)list=groups[cat]||[];if(q)list=list.filter(x=>x.t.includes(q));
  return `<div class="zad-quick">${ZQUICK.map(([id,t],i)=>`<button class="zq zq${i}" data-act="zadCh" data-id="${id}">${zSV(i===0?ZPI.dhuhr:i===1?ZPI.isha:i===2?ZPI.sunrise:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>')}<b>${t}</b></button>`).join("")}</div>
  ${ZST.idxErr&&!I.length?`<div class="empty">تعذّر جلب فهرس الأذكار الآن. <a href="https://hisnmuslim.com/i/ar/1" target="_blank" rel="noopener">افتح حصن المسلم ↗</a></div>`:!I.length?`<div class="empty">جاري تحميل الأذكار…</div>`:`
  <div class="zad-search"><input id="zad-dq" placeholder="ابحث في عناوين الأذكار…" value="${esc(ui.zq||"")}" data-change="zadDq"></div>
  <div class="zad-cats"><button class="${!cat?"on":""}" data-act="zadCat" data-v="">الكل <small>${I.length}</small></button>${names.map(n=>`<button class="${cat===n?"on":""}" data-act="zadCat" data-v="${esc(n)}">${esc(n)} <small>${groups[n].length}</small></button>`).join("")}</div>
  <div class="zad-chs">${list.map(x=>`<button class="zch" data-act="zadCh" data-id="${x.id}"><span>${esc(x.t)}</span><i>‹</i></button>`).join("")||`<div class="empty">لا نتائج</div>`}</div>`}`}
/* ===== الأحاديث (الدرر السنية) ===== */
const ZHOT=[["إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى","متفق عليه"],["خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ","رواه البخاري"],["اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ","رواه مسلم"],["مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا","رواه الترمذي"],["أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ","متفق عليه"],["الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ","متفق عليه"],["لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ","متفق عليه"],["مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ","رواه مسلم"],["تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ","رواه الترمذي"]];
const ZTOP=["القرآن","النية","الصبر","بر الوالدين","الصلاة","الصدقة","حسن الخلق","العلم","الذكر","الرحمة"];
function zHadithParse(html){const out=[];try{const doc=new DOMParser().parseFromString(String(html||""),"text/html");doc.querySelectorAll(".hadith").forEach(h=>{let inf=h.nextElementSibling;while(inf&&!inf.classList.contains("hadith-info"))inf=inf.nextElementSibling;const txt=(h.textContent||"").replace(/^\s*\d+\s*-\s*/,"").replace(/\s+/g," ").trim();const I={};if(inf){const s=(inf.textContent||"").replace(/\s+/g," ");const lab=[["r","الراوي:"],["m","المحدث:"],["src","المصدر:"],["no","الصفحة أو الرقم:"],["h","خلاصة حكم المحدث:"]];lab.forEach(([k,l],i)=>{const a=s.indexOf(l);if(a<0)return;let b=s.length;lab.slice(i+1).forEach(([,l2])=>{const j=s.indexOf(l2,a+l.length);if(j>=0&&j<b)b=j});I[k]=s.slice(a+l.length,b).trim()})}out.push({t:txt,...I})})}catch(e){}return out}
const ZH_ED=[["ara-nawawi","الأربعون النووية","27 ك.ب"],["ara-qudsi","الأحاديث القدسية","30 ك.ب"],["ara-bukhari","صحيح البخاري","5 م.ب"],["ara-muslim","صحيح مسلم","4.8 م.ب"]];
const zNorm=t=>String(t||"").replace(/[\u064B-\u0652\u0670\u0640\u06D6-\u06ED]/g,"").replace(/[إأآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/ؤ/g,"و").replace(/ئ/g,"ي");
ZST.hdb={};ZST.hdbLoad={};
async function zHLoad(ed){if(ZST.hdb[ed])return ZST.hdb[ed];if(ZST.hdbLoad[ed])return ZST.hdbLoad[ed];ZST.hdbLoad[ed]=(async()=>{const r=await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${ed}.min.json`);if(!r.ok)throw new Error(ed);const j=await r.json();const L=(j.hadiths||[]).filter(h=>h&&h.text).map(h=>({n:h.hadithnumber,t:String(h.text).trim(),g:(h.grades||[]).map(x=>x.grade).filter(Boolean)[0]||""}));L.forEach(h=>h.k=zNorm(h.t));ZST.hdb[ed]=L;return L})();try{return await ZST.hdbLoad[ed]}finally{ZST.hdbLoad[ed]=null}}
const zHSel=()=>Array.isArray(ui.zhSrc)&&ui.zhSrc.length?ui.zhSrc:["ara-nawawi","ara-qudsi","ara-bukhari","ara-muslim"];
async function zHSearch(q){q=(q||"").trim();if(!q)return;ui.zhq=q;ZST.hload=true;ZST.herr="";ZST.hres=null;ZST.hq=q;render();const words=zNorm(q).split(/\s+/).filter(w=>w.length>1).map(w=>/^(وال|بال|فال|كال)/.test(w)&&w.length>5?w.slice(3):/^ال/.test(w)&&w.length>4?w.slice(2):w);const out=[];const fail=[];
  for(const ed of zHSel()){const meta=ZH_ED.find(x=>x[0]===ed);try{ZST.hmsg=!ZST.hdb[ed]?`جاري تحميل ${meta[1]} (${meta[2]}) — مرة واحدة فقط`:"";if(ZST.hmsg)render();const L=await zHLoad(ed);for(const h of L){if(words.every(w=>h.k.includes(w))){out.push({t:h.t,src:meta[1],no:h.n,h:/bukhari|muslim/.test(ed)?"صحيح":(h.g||""),ed});if(out.length>=200)break}}}catch(e){fail.push(meta[1])}}
  out.sort((a,b)=>a.t.length-b.t.length);ZST.hres=out;ZST.hmsg="";ZST.hload=false;ZST.herr=fail.length&&!out.length?"تعذّر تحميل: "+fail.join("، ")+" — تحقق من الاتصال بالإنترنت.":"";render()}
const zRuling=h=>/ضعيف|موضوع|منكر|باطل|لا أصل|كذب/.test(h||"")?"bad":/صحيح|حسن|ثابت|متفق/.test(h||"")?"ok":"";
function zHadithTab(){const day=Math.floor(Date.now()/864e5);const hot=ZHOT[day%ZHOT.length];const R=ZST.hres;const sel=zHSel();const lim=ui.zhLim||30;
  return `<section class="zad-hod"><small>حديث اليوم</small><p>«${esc(hot[0])}»</p><span>${esc(hot[1])}</span></section>
  <div class="zad-search big"><input id="zad-hq" placeholder="ابحث عن حديث بكلمة أو أكثر… مثل: الصبر" value="${esc(ui.zhq||"")}" enterkeyhint="search"><button class="btn pri" data-act="zadHSearch">بحث</button></div>
  <div class="zad-src">${ZH_ED.map(([k,l])=>`<button class="${sel.includes(k)?"on":""}" data-act="zadHSrc" data-v="${k}">${sel.includes(k)?"✓ ":""}${l}</button>`).join("")}</div>
  <div class="zad-cats">${ZTOP.map(t=>`<button class="${ZST.hq===t?"on":""}" data-act="zadHTopic" data-v="${esc(t)}">${esc(t)}</button>`).join("")}</div>
  ${ZST.hload?`<div class="empty">${esc(ZST.hmsg||"جاري البحث…")}</div>`:ZST.herr?`<div class="empty">${esc(ZST.herr)}</div>`:R?`<div class="zad-bar"><span class="small muted">${R.length>=200?"أكثر من 200":R.length} نتيجة لـ «${esc(ZST.hq)}»</span><a class="small" href="https://dorar.net/hadith/search?q=${encodeURIComponent(ZST.hq)}" target="_blank" rel="noopener">ابحث أيضاً في الدرر السنية ↗</a></div>
  <div class="zad-hl">${R.slice(0,lim).map(x=>{const k=zRuling(x.h);return `<article class="hd"><p class="hd-t">${esc(x.t)}</p><div class="hd-i"><span><small>المصدر</small>${esc(x.src)} · رقم ${esc(String(x.no))}</span></div>${x.h?`<span class="hd-h ${k}">${esc(x.h)}</span>`:""}</article>`}).join("")||`<div class="empty">لا نتائج — جرّب كلمة أخرى أو أضف مصادر أكثر</div>`}</div>
  ${R.length>lim?`<button class="btn" data-act="zadHMore">عرض المزيد (${R.length-lim})</button>`:""}`:`<p class="small muted">البحث يتم داخل المنصة في كتب السنة المختارة أعلاه (بدون الحاجة لمواقع خارجية)، ويُحمَّل كل كتاب مرة واحدة ثم يبقى محفوظاً للاستخدام بدون إنترنت.</p>`}`}
/* ===== أعمالي اليومية ===== */
const ZDEF=[["sabah","أذكار الصباح","☀"],["masa","أذكار المساء","☾"],["wird","وردي من القرآن","📖"],["rawatib","السنن الرواتب","✦"],["duha","صلاة الضحى","◔"],["witr","الوتر / قيام الليل","✧"],["istighfar","الاستغفار ١٠٠ مرة","↺"],["salawat","الصلاة على النبي ﷺ","♡"],["sadaqa","صدقة ولو قليلة","❖"],["birr","بر الوالدين","♥"],["dua","دعاء لنفسي ولغيري","✋"]];
const ZFARD=[["fajr","الفجر"],["dhuhr","الظهر"],["asr","العصر"],["maghrib","المغرب"],["isha","العشاء"]];
function zDData(){const D=zls.get("d:"+zUid(),null)||{days:{},custom:[],hidden:[]};D.days=D.days||{};D.custom=D.custom||[];D.hidden=D.hidden||[];return D}
function zDItems(D){return [...ZDEF.filter(x=>!D.hidden.includes(x[0])),...D.custom.map(x=>[x[0],x[1],"•",1])]}
function zDPct(D,day){const s=D.days[day]||{};const it=zDItems(D);const tot=it.length+5;let n=ZFARD.filter(([k])=>s["p_"+k]).length+it.filter(([k])=>s[k]).length;return tot?Math.round(n/tot*100):0}
function zDailyTab(){const D0=zDData();const DR=ui.zdEdit&&ui.zdDraft;const D=DR?{...D0,custom:DR.custom,hidden:DR.hidden}:D0;const td=zYmd(new Date());const s=D.days[td]||{};const it=zDItems(D);const pct=zDPct(D,td);
  let streak=0;for(let i=0;i<365;i++){const d=new Date();d.setDate(d.getDate()-i);const p=zDPct(D,zYmd(d));if(p>=70)streak++;else if(i>0)break}
  const wk=[...Array(7)].map((_,i)=>{const d=new Date();const td=d.getDay();d.setDate(d.getDate()-td+i);const fut=i>td;return{d,i,fut,td:i===td,p:fut?0:zDPct(D,zYmd(d))}});
  return `<section class="zad-dh"><div class="zd-ring" style="--p:${pct}"><b>${pct}%</b><small>إنجاز اليوم</small></div><div class="grow"><h2>أعمالي اليومية</h2><p class="muted small">«أحبُّ الأعمال إلى الله أدومها وإن قل»</p><div class="zd-st"><span>🔥 <b>${streak}</b> يوم متتالٍ</span><span>✓ <b>${ZFARD.filter(([k])=>s["p_"+k]).length+it.filter(([k])=>s[k]).length}</b> من ${it.length+5}</span></div><div class="zd-wk">${wk.map(x=>`<i class="${x.td?"td":""} ${x.fut?"fu":""}" title="${x.fut?"":x.p+"%"}"><em style="height:${x.fut?4:Math.max(6,x.p)}%"></em><small>${["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"][x.i]}</small></i>`).join("")}</div></div></section>
  <div class="card"><div class="card-h"><h2>صلواتي اليوم</h2></div><div class="zd-pr">${ZFARD.map(([k,l])=>`<button class="${s["p_"+k]?"on":""}" data-act="zadDTog" data-k="p_${k}"><span>${zSV(ZPI[k])}</span>${l}</button>`).join("")}</div></div>
  <div class="card"><div class="card-h"><h2>أعمال اليوم</h2>${ui.zdEdit?`<div class="row" style="gap:6px"><button class="btn sm pri" data-act="zadDSave">حفظ التعديلات</button><button class="btn sm" data-act="zadDCancel">إلغاء</button></div>`:`<button class="btn sm ghost" data-act="zadDEdit">تعديل القائمة</button>`}</div>${ui.zdEdit?`<p class="hint" style="margin:-4px 0 8px">وضع التعديل: الحذف والإضافة لا تُطبَّق إلا بعد الضغط على «حفظ التعديلات».</p>`:""}
  <div class="zd-list">${it.map(([k,l,ic,cust])=>`<div class="zd-it ${s[k]?"on":""}"><button class="zd-ck" data-act="zadDTog" data-k="${esc(k)}"><span class="zd-box">${s[k]?"✓":""}</span><span class="zd-ic">${esc(ic)}</span><span class="zd-l">${esc(l)}</span></button>${ui.zdEdit?`<button class="btn sm ghost" data-act="zadDDel" data-k="${esc(k)}" data-c="${cust?1:""}" aria-label="حذف">✕</button>`:""}</div>`).join("")}</div>
  ${ui.zdEdit?`<div class="row" style="gap:8px;margin-top:10px"><input id="zad-dnew" placeholder="أضف عملاً جديداً، مثل: قراءة صفحة من كتاب" style="flex:1"><button class="btn pri sm" data-act="zadDAdd">إضافة</button></div>${(D.hidden.length||(DR&&DR.trash.length))?`<div class="zd-trash"><b class="small">المحذوفة — اضغط «إرجاع» لاستعادتها</b>${D.hidden.map(k=>{const x=ZDEF.find(z=>z[0]===k);return x?`<div class="zd-tr"><span>${esc(x[1])}</span><button class="btn sm" data-act="zadDUnhide" data-k="${esc(k)}">إرجاع</button></div>`:""}).join("")}${(DR?DR.trash:[]).map(x=>`<div class="zd-tr"><span>${esc(x[1])}</span><button class="btn sm" data-act="zadDUntrash" data-k="${esc(x[0])}">إرجاع</button></div>`).join("")}<button class="btn sm ghost" data-act="zadDRestore">إرجاع الكل</button></div>`:""}`:(D0.hidden.length||(D0.trash||[]).length)?`<button class="btn sm ghost" style="margin-top:8px" data-act="zadDEdit">لديك ${D0.hidden.length+(D0.trash||[]).length} أعمال محذوفة — استعادة</button>`:""}</div>`}
/* ===== الصفحة ===== */
function zadView(m){const t=ui.ztab||"pray";const T=[["pray","الصلاة",ZPI.dhuhr],["adhkar","الأذكار",'<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>'],["hadith","الأحاديث",'<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/>'],["daily","أعمالي",'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8.5 12l2.5 2.5 4.5-5"/>']];
  let body="";try{body=t==="adhkar"?zAdhkarTab():t==="hadith"?zHadithTab():t==="daily"?zDailyTab():zPrayTab()}catch(e){body=empty("تعذّر عرض هذا القسم")}
  return `<div class="zad"><nav class="zad-tabs" aria-label="أقسام زادي">${T.map(([k,l,ic])=>`<button class="${t===k?"on":""}" data-act="zadTab" data-v="${k}">${zSV(ic)}<span>${l}</span></button>`).join("")}</nav><div class="zad-body">${body}</div></div>`}
document.addEventListener("keydown",e=>{if(e.key!=="Enter")return;const t=e.target;if(t&&t.id==="zad-hq"){e.preventDefault();zHSearch(t.value)}else if(t&&t.id==="zad-dnew"){e.preventDefault();try{A.zadDAdd()}catch(_){}}});
document.addEventListener("input",e=>{const t=e.target;if(t&&t.id==="zad-dq"){ui.zq=t.value;clearTimeout(window.__zdq);window.__zdq=setTimeout(()=>{render()},350)}});
setTimeout(()=>{try{NAVICON.zad=SV('<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/><path d="M17 3l.7 1.6L19.3 5l-1.6.7L17 7.3l-.7-1.6L14.7 5l1.6-.4z"/>')}catch(e){}},0);

setTimeout(()=>{try{Object.assign(CH,{zadCity:el=>{if(+el.value===-1){zGeo(false);return}zls.set("city",+el.value);zls.set("pt",null);ZST.ptKey="";ZST.pt=null;zLoadPT(true);render()},zadAdhan:el=>{zls.set("adhan",el.checked);if(el.checked){try{if("Notification" in window&&Notification.permission==="default")Notification.requestPermission()}catch(e){}toast("سيتم تنبيهك عند دخول وقت كل صلاة ما دامت المنصة مفتوحة")}},zadSound:el=>zls.set("sound",el.checked),zadHOnly:el=>{ui.zhs=el.checked;render()},zadIq:el=>{const o=zls.get("iq",null)||{};const v=Math.max(0,Math.min(60,parseInt(el.value)||0));o[el.dataset.k]=v;zls.set("iq",o);render()},zadDq:()=>{}})}catch(e){}},0);

/* ===================== جدول الختمة (برنامج التلاوة) ===================== */
const KH_DAYS=[7,10,15,20,30,45,60,90];
function khCfg(s){const off=s.plan&&s.plan.khatma;const loc=zls.get("kh:"+s.id,null);return off&&off.start?{...off,official:true}:loc}
function khSurahAt(page){if(!Q||!Q.p||!Q.ss)return null;const vi=Q.p[page-1];if(vi==null)return null;let si=0;for(let i=0;i<Q.ss.length;i++){if(Q.ss[i]<=vi)si=i;else break}return {s:Q.s[si][0],a:vi-Q.ss[si]+1}}
function khEndSurah(page){if(!Q||!Q.p)return null;const next=page<604?Q.p[page]:null;const vi=next==null?(Q.ss[113]+Q.s[113][1]-1):next-1;let si=0;for(let i=0;i<Q.ss.length;i++){if(Q.ss[i]<=vi)si=i;else break}return {s:Q.s[si][0],a:vi-Q.ss[si]+1}}
const khJuz=p=>Math.min(30,Math.floor((p-2)/20)+1<1?1:Math.min(30,Math.ceil((p-1)/20)||1));
const KH_WD=[[5,"الجمعة"],[6,"السبت"],[0,"الأحد"],[1,"الاثنين"],[2,"الثلاثاء"],[3,"الأربعاء"],[4,"الخميس"]];
function khRows(K){const fp=Math.max(1,Math.min(604,+K.fp||1)),tp=Math.min(604,Math.max(fp,+K.tp||604)),span=tp-fp+1;let n=K.ppd?Math.ceil(span/Math.max(.5,+K.ppd)):Math.max(1,Math.min(730,+K.days||30));n=Math.min(n,730);const off=(K.off||[]).length<7?(K.off||[]):[];const skip=x=>off.includes(new Date(x+"T12:00:00").getDay());const R=[];let prev=fp-1,d=K.start;
  for(let i=1;i<=n;i++){let gd=0;while(off.length&&skip(d)&&gd++<8)d=addDays(d,1);const to=Math.max(prev,fp-1+Math.round(i*span/n));R.push({i,from:Math.min(prev+1,to)||fp,to:Math.max(to,fp),cum:to-fp+1,date:d});prev=to;d=addDays(d,1)}return R}
const khSpan=K=>Math.min(604,Math.max(+K.fp||1,+K.tp||604))-Math.max(1,+K.fp||1)+1;
const khIsCustom=K=>K&&((K.fp&&K.fp!==1)||(K.tp&&K.tp!==604)||K.ppd||(K.off&&K.off.length));
function khRangeTxt(K){const fp=+K.fp||1,tp=+K.tp||604;if(fp===1&&tp===604)return "المصحف كاملاً";try{const a=khSurahAt(fp),b=khEndSurah(tp);return `من ${a.s} ${AR_D(a.a)} إلى ${b.s} ${AR_D(b.a)} (ص ${AR_D(fp)}–${AR_D(tp)})`}catch(e){return `ص ${fp}–${tp}`}}
function khSumTxt(K){const R=khRows(K);const sp=khSpan(K);const off=(K.off||[]).map(d=>(KH_WD.find(w=>w[0]===d)||[,""])[1]).filter(Boolean);
  return `<b>${esc(khRangeTxt(K))}</b><span>${AR_D(sp)} صفحة · ${AR_D(R.length)} ${R.length>2&&R.length<11?"أيام":"يوماً"} · نحو ${AR_D(Math.ceil(sp/R.length))} ص يومياً</span><span>تنتهي ${esc(fmtShort(R[R.length-1].date))}${off.length?` · راحة: ${esc(off.join("، "))}`:""}</span>`}
function khCustomHTML(){const t0=today();const so=sel=>Q.s.map(([n],i)=>`<option value="${i}" ${i===sel?"selected":""}>${i+1}. ${esc(n)}</option>`).join("");const jo=sel=>Array.from({length:30},(_,i)=>`<option value="${i}" ${i===sel?"selected":""}>الجزء ${AR_D(i+1)}</option>`).join("");
  return `<div class="khc" data-rt="s" data-dv="d"><h4>ختمة مخصصة</h4>
  <div class="khc-f"><span>النطاق</span><div class="khc-seg"><button type="button" class="on" data-khr="s">سور</button><button type="button" data-khr="j">أجزاء</button><button type="button" data-khr="p">صفحات</button></div></div>
  <div class="khc-2 khc-r" data-r="s"><label>من<select id="khc-s1">${so(0)}</select></label><label>إلى<select id="khc-s2">${so(113)}</select></label></div>
  <div class="khc-2 khc-r" data-r="j" hidden><label>من<select id="khc-j1">${jo(0)}</select></label><label>إلى<select id="khc-j2">${jo(29)}</select></label></div>
  <div class="khc-2 khc-r" data-r="p" hidden><label>من صفحة<input id="khc-p1" type="number" min="1" max="604" value="1" inputmode="numeric"></label><label>إلى صفحة<input id="khc-p2" type="number" min="1" max="604" value="604" inputmode="numeric"></label></div>
  <div class="khc-f"><span>التقسيم</span><div class="khc-seg"><button type="button" class="on" data-khd="d">بعدد الأيام</button><button type="button" data-khd="p">بعدد الصفحات يومياً</button></div></div>
  <div class="khc-2"><label class="khc-dv" data-v="d">عدد الأيام<input id="khc-days" type="number" min="1" max="730" value="30" inputmode="numeric"></label><label class="khc-dv" data-v="p" hidden>صفحات كل يوم<input id="khc-ppd" type="number" min="0.5" max="100" step="0.5" value="5" inputmode="decimal"></label><label>تاريخ البدء<input id="khc-start" type="date" value="${esc(t0)}"></label></div>
  <div class="khc-f"><span>أيام الراحة <small>(لا ورد فيها)</small></span><div class="khc-wd">${KH_WD.map(([d,l])=>`<button type="button" data-khw="${d}">${l}</button>`).join("")}</div></div>
  <div class="khc-sum">${khSumTxt({start:t0,fp:1,tp:604,days:30})}</div></div>`}
function khRead(c){const v=id=>+((c.querySelector("#"+id)||{}).value);let fp=1,tp=604;const rt=c.dataset.rt;
  if(rt==="s"){let a=v("khc-s1")||0,b=v("khc-s2");if(isNaN(b))b=113;if(b<a)[a,b]=[b,a];fp=pageOf(Q.ss[a]);tp=pageOf(Q.ss[b]+Q.s[b][1]-1)}
  else if(rt==="j"){let a=v("khc-j1")||0,b=v("khc-j2");if(isNaN(b))b=29;if(b<a)[a,b]=[b,a];fp=pageOf(Q.j[a]);tp=pageOf(b<29?Q.j[b+1]-1:Q.v.length-1)}
  else{fp=Math.min(604,Math.max(1,v("khc-p1")||1));tp=Math.min(604,Math.max(fp,v("khc-p2")||604))}
  let off=[...c.querySelectorAll("[data-khw].on")].map(x=>+x.dataset.khw);if(off.length>=7)off=[];
  const K={start:(c.querySelector("#khc-start")||{}).value||today(),fp,tp};if(off.length)K.off=off;if(c.dataset.dv==="p")K.ppd=Math.max(.5,v("khc-ppd")||1);else K.days=Math.max(1,Math.min(730,v("khc-days")||30));K.days=khRows(K).length;return K}
(function(){const sum=c=>{try{const s=c.querySelector(".khc-sum");if(s)s.innerHTML=khSumTxt(khRead(c))}catch(e){}};
  document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".khc [data-khr],.khc [data-khd],.khc [data-khw]");if(!b)return;e.preventDefault();e.stopPropagation();const c=b.closest(".khc");
    if(b.dataset.khr){c.dataset.rt=b.dataset.khr;c.querySelectorAll("[data-khr]").forEach(x=>x.classList.toggle("on",x===b));c.querySelectorAll(".khc-r").forEach(x=>x.hidden=x.dataset.r!==b.dataset.khr)}
    else if(b.dataset.khd){c.dataset.dv=b.dataset.khd;c.querySelectorAll("[data-khd]").forEach(x=>x.classList.toggle("on",x===b));c.querySelectorAll(".khc-dv").forEach(x=>x.hidden=x.dataset.v!==b.dataset.khd)}
    else b.classList.toggle("on");sum(c)},true);
  ["input","change"].forEach(ev=>document.addEventListener(ev,e=>{const c=e.target.closest&&e.target.closest(".khc");if(c)sum(c)},true))})();
function khatmaHTML(s,staff){try{loadQuran()}catch(e){}const K=khCfg(s);const t0=today();
  if(!K||!K.start)return `<section class="card kh"><div class="card-h"><h2>جدول الختمة</h2></div><p class="hint">اختر مدة الختمة وتاريخ البدء، ويُقسَّم المصحف (٦٠٤ صفحة) على الأيام تلقائياً مع بيان السور.</p>
   <div class="kh-days">${KH_DAYS.map(d=>`<button class="${(ui.khD||30)===d?"on":""}" data-act="khPick" data-v="${d}"><b>${d}</b><small>يوماً</small><i>${Math.ceil(604/d)} ص/يوم</i></button>`).join("")}<button class="khc-t ${ui.khD==="c"?"on":""}" data-act="khPick" data-v="c"><b>✎</b><small>مخصصة</small><i>نطاق وأيام</i></button></div>${ui.khD==="c"?khCustomHTML():""}
   <div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap">${ui.khD==="c"?"":`<label class="row small">تبدأ من: <input type="date" id="kh-start" value="${esc(ui.khS||t0)}"></label>`}<button class="btn pri" data-act="khStart" data-id="${esc(s.id)}" data-st="${staff?1:""}">ابدأ الختمة</button></div></section>`;
  const R=khRows(K);const total=khSpan(K);const read=logsOf(s.id,K.start).reduce((a,l)=>a+n0(l.tPages),0);const manual=zls.get("khm:"+s.id+":"+K.start,{});
  const todayRow=R.find(r=>r.date===t0)||(t0>R[R.length-1].date?R[R.length-1]:null);const expected=todayRow?todayRow.cum:0;
  const doneRow=r=>read>=r.cum||manual[r.i];const doneN=R.filter(doneRow).length;const pct=Math.min(100,Math.round(Math.max(read,(R.filter(doneRow).slice(-1)[0]||{cum:0}).cum)/total*100));
  const diff=Math.max(read,(R.filter(doneRow).slice(-1)[0]||{cum:0}).cum)-expected;const end=R[R.length-1].date;const showAll=!!ui.khAll;
  const vis=showAll?R:R.filter(r=>r.date>=addDays(t0,-2)).slice(0,7);
  const nm=p=>{const a=khSurahAt(p);return a?`${esc(a.s)} ${AR_D(a.a)}`:""};const nmE=p=>{const a=khEndSurah(p);return a?`${esc(a.s)} ${AR_D(a.a)}`:""};
  return `<section class="card kh"><div class="card-h"><h2>جدول الختمة</h2><div class="row" style="gap:6px">${K.official?`<span class="pill p-ok">معتمد من المعلم</span>`:`<span class="pill">خطتي الشخصية</span>`}${staff&&!K.official?`<button class="btn sm pri" data-act="khApprove" data-id="${esc(s.id)}">اعتماد للطالب</button>`:""}<button class="btn sm ghost" data-act="khReset" data-id="${esc(s.id)}" data-st="${staff?1:""}">ختمة جديدة</button></div></div>
  <div class="kh-sum"><div class="kh-ring" style="--p:${pct}"><b>${pct}%</b><small>من المصحف</small></div><div class="kh-st"><span><small>المدة</small><b>${R.length} يوماً</b></span><span><small>الورد اليومي</small><b>~${Math.ceil(total/R.length)} صفحة</b></span>${khIsCustom(K)?`<span style="grid-column:1/-1"><small>النطاق</small><b>${esc(khRangeTxt(K))}</b></span>`:""}<span><small>تنتهي</small><b>${esc(fmtShort(end))}</b></span><span><small>الأيام المنجزة</small><b>${doneN}/${R.length}</b></span></div>
  <div class="kh-flag ${diff>=0?"ok":"late"}">${t0<K.start?"لم تبدأ الختمة بعد":diff>=0?(diff>0?`متقدم ${diff} صفحة عن الجدول 🌟`:"على الموعد تماماً ✓"):`متأخر ${-diff} صفحة — يمكنك التعويض بزيادة يسيرة كل يوم`}</div></div>
  <div class="kh-tbl" role="table"><div class="kh-h" role="row"><span>اليوم</span><span>التاريخ</span><span>من</span><span>إلى</span><span>الصفحات</span><span></span></div>
  ${vis.map(r=>{const ok=doneRow(r);const cur=r.date===t0;return `<div class="kh-r ${ok?"ok":""} ${cur?"cur":""} ${!ok&&r.date<t0?"late":""}" role="row"><span class="kh-n">${AR_D(r.i)}</span><span>${esc(fmtShort(r.date))}${cur?` <i class="pill p-acc">اليوم</i>`:""}</span><span>${nm(r.from)||"ص "+r.from}</span><span>${nmE(r.to)||"ص "+r.to}</span><span class="num">${r.from}–${r.to}</span><span><button class="kh-ck" data-act="khTick" data-id="${esc(s.id)}" data-i="${r.i}" aria-label="تم">${ok?"✓":""}</button></span></div>`}).join("")}</div>
  <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn sm" data-act="khAll">${showAll?"عرض الأيام القريبة فقط":"عرض الجدول كاملاً ("+R.length+" يوماً)"}</button><button class="btn sm ghost" data-act="khCopy" data-id="${esc(s.id)}">نسخ الجدول</button></div>
  <p class="small muted" style="margin-top:6px">يُحتسب الإنجاز تلقائياً من صفحات التلاوة المسجّلة في متابعة المعلم، ويمكنك أيضاً تعليم اليوم يدوياً.</p></section>`}

setTimeout(()=>{try{Object.assign(CH,{feProp:el=>{const p=el.dataset.p;const val=el.type==="range"?Number(el.value):el.value;setFreeMany(()=>({[p]:val}))}})}catch(e){}},0);

/* ===== تسجيل الطالب لورده/تسميعه اليوم — لا يُعتمد إلا بعد تأكيد المعلم ===== */
const SW_T={hifz:["حفظ جديد","newPages"],review:["مراجعة","revPages"],tilawa:["تلاوة","tPages"]};
function selfWirdCard(m){const L=S.recits.filter(r=>r.kind==="self"&&r.studentId===m.id).sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||"")).slice(0,5);
  const st=r=>r.status!=="reviewed"?`<span class="pill p-warn">⏳ بانتظار تأكيد المعلم</span>`:r.rejected?`<span class="pill p-bad">يحتاج إعادة</span>`:`<span class="pill p-ok">✓ أكّده المعلم${r.grade?" · "+esc(GR&&GR[r.grade]||r.grade):""}</span>`;
  return `<section class="card sw-card"><div class="card-h"><h2>سجّل وردك اليوم</h2><button class="btn pri sm" data-act="selfWird">＋ تسجيل ورد/تسميع</button></div>
  <p class="hint">سجّل ما حفظته أو راجعته أو قرأته اليوم، ولن يُحتسب في سجلك إلا بعد أن يراجعه معلمك ويؤكده.</p>
  ${L.length?`<div class="list">${L.map(r=>`<div class="li"><span class="sw-k sw-${esc(r.wtype||"hifz")}">${esc((SW_T[r.wtype]||SW_T.hifz)[0])}</span><div class="grow"><div class="t">${esc(r.title||"")}</div><div class="small muted">${fmtShort(r.date)}${r.pages?` · ${esc(String(r.pages))} وجه`:""}${r.feedback?` · ${esc(r.feedback)}`:""}</div></div>${st(r)}</div>`).join("")}</div>`:""}</section>`}
function selfWirdForm(){const m=me();openModal("تسجيل وردي اليوم",`<div class="fg">${fld("النوع",`<select name="wtype" id="f-wtype"><option value="hifz">حفظ جديد</option><option value="review">مراجعة</option><option value="tilawa">تلاوة</option></select>`)}${fld("عدد الأوجه",`<input type="number" name="pages" id="f-pages" min="0" max="604" step="0.5" placeholder="مثال: 1">`)}</div>
  ${fld("المقطع",`<input name="title" id="f-title" required placeholder="مثال: سورة الملك من آية 1 إلى 15">`)}${fld("ملاحظة لمعلمك (اختياري)",`<textarea name="note" id="f-note" placeholder="مثال: سمّعته على والدي"></textarea>`)}
  <p class="hint">سيصل لمعلمك ليراجعه، ولا يُعتمد في سجلك إلا بعد تأكيده.</p>`,"selfWird",{},"إرسال للمعلم")}
function selfReviewForm(r){if(!r)return;const T=SW_T[r.wtype]||SW_T.hifz;
  openModal("مراجعة ورد الطالب وتأكيده",`<p><b>${esc(nameOf(r.studentId))}</b> · <span class="muted">${fmtShort(r.date)}</span></p><div class="sw-sum"><span class="sw-k sw-${esc(r.wtype||"hifz")}">${esc(T[0])}</span><b>${esc(r.title||"")}</b>${r.pages?`<span>${esc(String(r.pages))} وجه</span>`:""}</div>${r.note?`<p class="small muted">ملاحظة الطالب: ${esc(r.note)}</p>`:""}
  <div class="fg">${fld("التقدير",gradeSel("grade",r.grade))}${fld("عدد الأوجه المعتمدة",`<input type="number" name="pages" id="f-pages" min="0" max="604" step="0.5" value="${esc(String(r.pages||""))}">`)}</div>${fld("ملاحظتك للطالب",`<textarea name="feedback" id="f-feedback">${esc(r.feedback||"")}</textarea>`)}
  <p class="hint">عند التأكيد تُضاف الأوجه إلى سجل الطالب لهذا اليوم تلقائياً.</p>`,"selfConfirm",{id:r.id},"✓ تأكيد واعتماد",`<button type="button" class="btn" data-act="selfReject" data-id="${r.id}">إرجاعه للطالب</button>`)}
setTimeout(()=>{try{Object.assign(FORMS,{
  selfWird:async fd=>{const m=me();const title=(fd.get("title")||"").trim();if(!title){toast("اكتب المقطع","err");throw new Error("t")}put("recits","r"+gen(),{studentId:m.id,teacherId:m.teacherId||"",date:today(),createdAt:new Date().toISOString(),kind:"self",wtype:fd.get("wtype")||"hifz",title,pages:+fd.get("pages")||0,note:fd.get("note")||"",status:"pending"});toast("أُرسل لمعلمك، وسيُعتمد بعد تأكيده")},
  selfConfirm:async(fd,ctx)=>{const r=get("recits",(ctx||modalCtx||{}).id);if(!r)return;const pages=+fd.get("pages")||0;const T=SW_T[r.wtype]||SW_T.hifz;
    put("recits",r.id,{...r,status:"reviewed",confirmed:true,rejected:false,grade:fd.get("grade")||"",feedback:fd.get("feedback")||"",pages,reviewedAt:new Date().toISOString(),reviewedBy:(me()||{}).id||""});
    if(pages>0){const id=`${r.studentId}_${r.date}`;const lg=get("logs",id)||{studentId:r.studentId,date:r.date};const d={...lg};delete d.id;d[T[1]]=+((+d[T[1]]||0)+pages).toFixed(2);d.selfNote=[(lg.selfNote||""),`${T[0]}: ${r.title}`].filter(Boolean).join(" · ");put("logs",id,d)}
    toast("اعتُمد وأُضيف إلى سجل الطالب")}})}catch(e){}},0);

/* ===================== وضع القراءة: مصحف بملء الشاشة ===================== */
const RD={on:false,pg:1,chrome:true,sheet:null,g:null,idx:"s",tf:{},tfSrc:null,poll:0,playG:null,bmEdit:false};
const RBM=[["red","الأحمر","#e5484d"],["yellow","الأصفر","#f5b301"],["green","الأخضر","#2fb36a"],["blue","الأزرق","#3b82f6"]];
const RHL=[["","بدون"],["#ff8a00","برتقالي"],["#f5c547","أصفر"],["#2fb36a","أخضر"],["#3b82f6","أزرق"],["#a855f7","بنفسجي"]];
const RTAF=[["ar-tafsir-muyassar","التفسير الميسر"],["ar-tafseer-al-saddi","تفسير السعدي"],["ar-tafsir-ibn-kathir","تفسير ابن كثير"],["ar-tafsir-al-baghawi","تفسير البغوي"]];
setTimeout(()=>{try{[["Muhammad_Ayyoub_128kbps","محمد أيوب"],["Abdul_Basit_Murattal_192kbps","عبدالباسط عبدالصمد (مرتل)"],["Abdurrahmaan_As-Sudais_192kbps","عبدالرحمن السديس"],["Saood_ash-Shuraym_128kbps","سعود الشريم"],["MaherAlMuaiqly128kbps","ماهر المعيقلي"],["Ghamadi_40kbps","سعد الغامدي"],["Yasser_Ad-Dussary_128kbps","ياسر الدوسري"],["Hudhaify_128kbps","علي الحذيفي"],["Ali_Jaber_64kbps","علي جابر"],["Ayman_Sowaid_64kbps","أيمن سويد (تعليمي)"]].forEach(r=>{if(!RECITERS.some(x=>x[0]===r[0]))RECITERS.push(r)})}catch(e){}},0);
const RRUB=[0,32,50,66,81,98,112,130,148,164,183,195,209,225,239,249,259,269,278,289,307,325,344,367,385,405,425,445,463,478,493,504,516,528,550,566,580,592,606,627,640,655,669,680,695,709,719,735,750,765,777,801,824,847,862,883,899,915,929,939,954,984,1000,1018,1041,1070,1095,1109,1124,1142,1160,1181,1200,1220,1235,1253,1268,1280,1294,1309,1327,1345,1356,1374,1389,1416,1434,1453,1478,1496,1513,1533,1556,1580,1602,1625,1648,1672,1696,1711,1725,1741,1759,1777,1802,1851,1901,1930,1951,1975,1990,2011,2029,2051,2078,2098,2127,2156,2171,2190,2214,2238,2271,2308,2348,2402,2430,2458,2483,2511,2533,2565,2595,2613,2632,2654,2673,2708,2747,2791,2811,2825,2843,2855,2875,2907,2932,2983,3042,3112,3159,3185,3214,3240,3263,3280,3302,3327,3340,3365,3385,3409,3439,3462,3490,3513,3533,3550,3563,3583,3592,3615,3629,3651,3674,3700,3732,3764,3809,3870,3932,3990,4021,4065,4089,4110,4133,4153,4173,4198,4226,4242,4264,4284,4298,4322,4348,4381,4430,4484,4510,4530,4554,4577,4600,4612,4625,4656,4705,4758,4809,4854,4901,4979,5053,5090,5104,5117,5136,5156,5177,5191,5217,5229,5241,5271,5323,5393,5447,5494,5551,5609,5672,5758,5829,5884,5948,6023,6090,6154];const RMK="100001100111011111111010111111110111111111111100011111010000000000111111111011111111111111111111100111111111101111";
const RTABS=["idx","today","kh","bm","hl"];const rMk=i=>RMK[i]==="1";const rDig=x=>String(x).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d));
const rRing=(f,lbl)=>`<svg class="rd-ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="3"/>${f>=1?`<circle cx="18" cy="18" r="15" fill="var(--rd-acc)"/>`:`<circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(88*f).toFixed(1)} 88" transform="rotate(-90 18 18)"/>`}${lbl?`<text x="18" y="22.5" text-anchor="middle" font-size="12" font-weight="700" fill="${f>=1?"#06210f":"currentColor"}">${lbl}</text>`:""}</svg>`;
const rSnip=(g,n)=>{const w=Q.v[g].split(" ");return esc(w.slice(0,n||6).join(" "))+(w.length>(n||6)?"…":"")};
const rSurLi=(i,pg,cur)=>{const p=pageOf(Q.ss[i]);return `<button class="rd-li rd-sli ${cur?"cur":""}" data-ract="go" data-v="${p}"><i>${AR_D(i+1)}</i><span><b>${esc(Q.s[i][0])}</b><small>${rMk(i)?"مكية":"مدنية"} · ${AR_D(Q.s[i][1])} ${Q.s[i][1]>10?"آية":"آيات"}</small></span><em>${AR_D(p)} ‹</em></button>`};
const rU=()=>zUid();
/* مزامنة بيانات المصحف بين أجهزة المستخدم: صف واحد خاص به في جدول progress (مسموح له بالكتابة فيه) */
function rdRowId(){try{const m=realMe();return m&&!m.virtual&&m.id?"rd__"+m.id:null}catch(e){return null}}
function rdPushNow(){try{const id=rdRowId();if(!id)return;const u=rU();const d={studentId:u,kind:"reader",bm:zls.get("rbm:"+u,{}),hl:zls.get("rhl:"+u,{}),kh:zls.get("rk:"+u,null),last:zls.get("rlast",0)||0,at:Date.now()};
  const cur=get("progress",id);if(cur&&JSON.stringify([cur.bm,cur.hl,cur.kh,cur.last])===JSON.stringify([d.bm,d.hl,d.kh,d.last]))return;
  zls.set("rdat:"+u,d.at);local("progress",id,{...d,updatedAt:Date.now()});if(MODE==="live")remotePut("progress",id,{...d,updatedAt:Date.now()}).catch(()=>{})}catch(e){}}
function rdPush(){clearTimeout(RD._psT);RD._psT=setTimeout(rdPushNow,1500)}
function rdPull(){try{const id=rdRowId();if(!id)return false;const r=get("progress",id);if(!r||!r.at)return false;const u=rU();if(r.at<=zls.get("rdat:"+u,0))return false;
  RD._pulling=true;zls.set("rbm:"+u,r.bm||{});zls.set("rhl:"+u,r.hl||{});zls.set("rk:"+u,r.kh||null);if(r.last)zls.set("rlast",r.last);zls.set("rdat:"+u,r.at);return true}catch(e){return false}finally{RD._pulling=false}}
{const _zs=zls.set;zls.set=function(k,v){_zs.call(zls,k,v);if(!RD._pulling&&/^(rbm|rhl|rk):/.test(k))rdPush()}}
addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&RD.pg)rdPushNow()});addEventListener("pagehide",()=>{try{rdPushNow()}catch(e){}});
const rBM=()=>zls.get("rbm:"+rU(),{});const rHL=()=>zls.get("rhl:"+rU(),{});
const rSA=g=>{const[si,a]=sa(g);return `${Q.s[si][0]}: ${AR_D(a)}`};
function rOpen(pg){if(!Q){loadQuran();toast("جاري تحميل المصحف…");setTimeout(()=>rOpen(pg),700);return}if(!MQ&&MQLOAD!=="err")loadMushaf();
  if(RD.embedOn&&document.getElementById("rd-host")){if(pg)RD.pg=Math.min(604,Math.max(1,pg));rFull(true);return}
  rdPull();RD.on=true;RD.embedOn=false;RD.full=true;RD.pg=Math.min(604,Math.max(1,pg||zls.get("rlast",0)||ui.mpage||1));RD.openPg=RD.pg;RD.prev=null;RD.sheet=null;RD.g=null;RD.chrome=false;
  let o=document.getElementById("mreader");if(!o){o=document.createElement("div");o.id="mreader";o.setAttribute("role","dialog");o.setAttribute("aria-label","المصحف الشريف");document.body.appendChild(o);rBind(o)}
  document.body.classList.add("rd-open");try{const de=document.documentElement;if(de.requestFullscreen&&!document.fullscreenElement&&innerWidth<1100)de.requestFullscreen().catch(()=>{})}catch(e){}rRender()}
function rAyHL(o){o=o||document.getElementById("mreader");if(!o)return;o.querySelectorAll(".rd-ayhl").forEach(x=>x.remove());const ws=[...o.querySelectorAll(".rd-stage .rd-cur")];if(!ws.length)return;const G=new Map();
  ws.forEach(w=>{const l=w.closest(".ql")||w.parentNode;if(!G.has(l))G.set(l,[]);G.get(l).push(w)});
  G.forEach((arr,l)=>{const pg=l.closest(".rd-page");if(!pg)return;const last=arr[arr.length-1];let nx=last.nextElementSibling;const ex=[];while(nx&&!nx.hasAttribute("data-rk")){if(nx.classList.contains("qe"))ex.push(nx);nx=nx.nextElementSibling;if(ex.length)break}
    const R=[...arr,...ex].map(e=>e.getBoundingClientRect());const lr=l.getBoundingClientRect(),pr=pg.getBoundingClientRect();const left=Math.min(...R.map(r=>r.left)),right=Math.max(...R.map(r=>r.right));
    const d=document.createElement("i");d.className="rd-ayhl";Object.assign(d.style,{left:(left-pr.left-3)+"px",width:(right-left+6)+"px",top:(lr.top-pr.top+lr.height*.08)+"px",height:(lr.height*.84)+"px"});pg.appendChild(d)})}
function rTmBar(){const m=me();const c={t:0,l:0};Object.values(ui.marks).forEach(v=>{if(v)c[MT(v.t)]++});let st=[];try{st=myStudents(m).filter(s=>canAttend(m,s))}catch(e){}
  return `<div class="rd-tmbar"><select id="rd-stu" data-change="mStu" aria-label="الطالب"><option value="">— الطالب —</option>${st.map(s=>`<option value="${s.id}" ${ui.mstu===s.id?"selected":""}>${esc(s.name)}</option>`).join("")}</select><span class="tb-t">تنبيه <b>${AR_D(c.t)}</b></span><span class="tb-l">تلقين <b>${AR_D(c.l)}</b></span><button data-act="saveTasmee" ${ui.mstu&&(c.t+c.l)?"":"disabled"}>حفظ في سجل اليوم</button></div>`}
/* موضع الخطأ داخل الكلمة: تخفيف لون الكلمة + إبراز منطقة الحرف + وسم صغير بالحرف/الحركة */
function rMkZ(o){o=o||document.getElementById("mreader");if(!o)return;o.querySelectorAll(".rd-mkz,.rd-mkb").forEach(x=>x.remove());let HM=null;try{const sid=rHeatSid();if(sid&&zls.get("rheat",true)!==false)HM=heatMap(sid)}catch(e){}
  o.querySelectorAll(".rd-stage>.rd-page [data-rk], .rd-stage>.rd-spread .rd-page [data-rk]").forEach(w=>{const k=w.dataset.rk;const m=ui.marks[k]||(HM&&HM[k]);if(!m||m.c==null)return;const[g,wi]=k.split(":").map(Number);const txt=wtext(g,wi);const cl=CLUS(txt);if(!cl[m.c])return;
    const t=ui.marks[k]?MT(m.t):(m.lt||"t");const pg=w.closest(".rd-page");const r=w.getBoundingClientRect(),pr=pg.getBoundingClientRect();
    const wt=c=>{const b=c[0];return /[اأإآٱدذرزوؤةء]/.test(b)?.75:/[سشصضطظ]/.test(b)?1.45:/[لك]/.test(b)?.9:1};const tot=cl.reduce((a,c)=>a+wt(c),0);let off=0;for(let i=0;i<m.c;i++)off+=wt(cl[i]);
    const x2=r.right-off/tot*r.width,x1=x2-wt(cl[m.c])/tot*r.width;w.classList.add("mk-part");
    const z=document.createElement("i");z.className="rd-mkz "+t;Object.assign(z.style,{left:(x1-pr.left-2)+"px",width:(x2-x1+4)+"px",top:(r.top-pr.top)+"px",height:r.height+"px"});pg.appendChild(z);
    const hv=m.h!=null?[...cl[m.c]].slice(1)[m.h]:null;const bdg=document.createElement("i");bdg.className="rd-mkb "+t;bdg.innerHTML=`<b>${esc(cl[m.c])}</b>${hv&&HARAKA[hv]?`<small>${esc(HARAKA[hv])}</small>`:""}`;Object.assign(bdg.style,{left:((x1+x2)/2-pr.left)+"px",top:(r.top-pr.top)+"px"});pg.appendChild(bdg)})}
function rTmSync(){const c={t:0,l:0};Object.values(ui.marks).forEach(v=>{if(v)c[MT(v.t)]++});const card=document.querySelector(".card.tasmee");if(!card)return;const a=card.querySelector(".mlegend.mt-t .num"),b=card.querySelector(".mlegend.mt-l .num");if(a)a.textContent=c.t;if(b)b.textContent=c.l;const sv=card.querySelector('[data-act="saveTasmee"]');if(sv)sv.disabled=!(ui.mstu&&(c.t+c.l))}
async function rOffDl(){if(RD.offRun)return;RD.offRun=true;rRender(true);const C=typeof caches!=="undefined"?await caches.open("maeen-mushaf-1").catch(()=>null):null;
  const P=t=>{const e=document.getElementById("rd-offp");if(e)e.textContent=t};const fonts=new Set(["QCF4_QBSML"]);let done=0,fail=0;
  const one=async u=>{try{if(C&&await C.match(u))return await (u.endsWith(".json")?(await C.match(u)).json():null);const r=await fetch(u);if(!r.ok)throw 0;if(C)await C.put(u,r.clone());return u.endsWith(".json")?await r.json():null}catch(e){fail++;return null}};
  const pages=Array.from({length:604},(_,i)=>i+1);let k=0;const work=async()=>{while(k<pages.length){const pg=pages[k++];const d=await one(`${QCF_CDN}pages/${String(pg).padStart(3,"0")}.json`);if(d&&d.lines)d.lines.forEach(l=>(l.words||[]).forEach(w=>w.font&&fonts.add(w.font)));done++;if(done%8===0)P(`الصفحات ${AR_D(done)} من ٦٠٤…`)}};
  await Promise.all([work(),work(),work(),work(),work(),work()]);const F=[...fonts];let f=0;for(const n of F){await one(`${QCF_CDN}fonts-woff2/${n==="QCF4_QBSML"?n:n+"_W"}.woff2`);f++;P(`الخطوط ${AR_D(f)} من ${AR_D(F.length)}…`)}
  RD.offRun=false;if(fail<5){zls.set("offdone",Date.now());toast("حُفظ المصحف كاملاً على جهازك")}else toast("تعذّر تنزيل بعض الصفحات — أعد المحاولة","err");rRender(true)}
function rTasmee(){try{const m=me();return !!(m&&isStaff(m)&&ui.tasmee)}catch(e){return false}}
function rEmbedH(){const _o=document.getElementById("mreader");const host=document.getElementById("rd-host");if(!host)return;const hd=document.querySelector("header.top");const tb=document.querySelector(".tabbar");const tbh=tb&&getComputedStyle(tb).display!=="none"&&getComputedStyle(tb).position==="fixed"?tb.offsetHeight:0;
  const h=Math.max(380,innerHeight-(hd?hd.offsetHeight:0)-tbh-20);host.style.height=h+"px";RD._hostH=h;if(_o){_o.style.setProperty("--rdW",host.clientWidth+"px");_o.style.setProperty("--rdH",h+"px")}}
function rMountEmbed(){const host=document.getElementById("rd-host");if(!host||!Q)return;let o=RD.el&&RD.el.id==="mreader"?RD.el:document.getElementById("mreader");
  if(!o){o=document.createElement("div");o.id="mreader";o.setAttribute("aria-label","المصحف الشريف");rBind(o)}RD.el=o;
  if(!RD.embedOn){rdPull();RD.embedOn=true;RD.full=false;RD.on=true;const lp=zls.get("rlast",0);RD.pg=Math.min(604,Math.max(1,(ui.mpage&&ui.mpage!==1)?ui.mpage:(lp||1)));RD.openPg=RD.pg;RD.sheet=null;RD.g=null;RD.chrome=false;RD.prev=null}
  else if(!RD.full&&ui.mpage&&ui.mpage!==RD.pg){RD.pg=ui.mpage}
  RD.on=true;rEmbedH();if(!RD.full&&o.parentNode!==host)host.appendChild(o);o.style.setProperty("--rdW",host.clientWidth+"px");o.style.setProperty("--rdH",(parseFloat(host.style.height)||host.clientHeight)+"px");rRender(true)}
function rFull(on){const o=RD.el||document.getElementById("mreader");if(!o)return;if(on){RD.full=true;document.body.appendChild(o);document.body.classList.add("rd-open");try{const de=document.documentElement;if(de.requestFullscreen&&!document.fullscreenElement&&innerWidth<1100)de.requestFullscreen().catch(()=>{})}catch(e){}rRender(true)}
  else{RD.full=false;document.body.classList.remove("rd-open");try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}const host=document.getElementById("rd-host");if(host){host.appendChild(o);rEmbedH();rRender(true)}else{RD.embedOn=false;rClose()}}}
addEventListener("resize",()=>{if(RD.embedOn&&!RD.full){rEmbedH();clearTimeout(RD._rzT);RD._rzT=setTimeout(()=>rRender(true),120)}});
function rClose(){rdPushNow();if(RD.embedOn&&RD.full&&document.getElementById("rd-host")){rFull(false);return}RD.on=false;RD.embedOn=false;RD.full=false;const o=document.getElementById("mreader");if(o)o.remove();document.body.classList.remove("rd-open");try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}ui.mpage=RD.pg;try{render()}catch(e){}}
function rGo(pg,g){const np=Math.min(604,Math.max(1,pg));const done=()=>{if(Math.abs(np-RD.pg)>2)RD.prev=RD.pg;RD.pg=np;if(g!=null)RD.g=g;zls.set("rlast",RD.pg);RD.sheet=g!=null?RD.sheet:null;rRender()};
  const a0=np%2?np:np-1;const need=rSpread()?[a0,a0+1].filter(p=>p<=604):[np];const ready=()=>QCF_OFF||typeof FontFace==="undefined"||need.every(p=>QCFP[p]&&QCFP[p].lines);
  if(ready())return done();need.forEach(p=>qcfLoad(p));const tok=RD._goTok=(RD._goTok||0)+1,t0=Date.now();const w=()=>{if(tok!==RD._goTok)return;if(ready()||Date.now()-t0>1600)return done();setTimeout(w,40)};w()}
function rPageHTML(pg){let h="",kind="";const QD=qcfLoad(pg);
  if(QD&&QD.lines){h=qcfPageHTML(QD,true);kind="mqcf"}else if(MQ){h=mqPageHTML(pg,true);kind="m15"}else{const f=Q.p[pg-1],t=(pg<604?Q.p[pg]:Q.v.length)-1;let para=[];
    for(let g=f;g<=t;g++){const[si,a]=sa(g);if(a===1){if(para.length){h+=`<p class="mp">${para.join(" ")}</p>`;para=[]}h+=`<div class="sura-h"><span>سورة ${Q.s[si][0]}</span></div>`;if(si!==0&&si!==8)h+=`<div class="basm">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>`}
      para.push(`<span class="ay">${Q.v[g].split(" ").map((w,wi)=>`<span class="w" data-rk="${g}:${wi}">${w}</span>`).join(" ")}<span class="an">${AR_D(a)}</span></span>`)}if(para.length)h+=`<p class="mp">${para.join(" ")}</p>`}
  if(QD&&QD.loading){RD.wait=RD.wait||{};if(!RD.wait[pg]){RD.wait[pg]=1;const tick=n=>{if(!RD.on){delete RD.wait[pg];return}const vis=rSpread()?[RD.pg%2?RD.pg:RD.pg-1,(RD.pg%2?RD.pg:RD.pg-1)+1]:[RD.pg];if(!vis.includes(pg)){delete RD.wait[pg];return}if(QCFP[pg]&&QCFP[pg].lines){delete RD.wait[pg];rRender(true);return}if(!QCFP[pg]||n>60){delete RD.wait[pg];if(!QCFP[pg]&&!QCF_OFF)setTimeout(()=>{if(RD.on)rRender(true)},800);return}setTimeout(()=>tick(n+1),200)};setTimeout(()=>tick(0),200)}}
  setTimeout(()=>{[1,-1,2,-2,3].forEach(d=>{const q=pg+d;if(q>=1&&q<=604)qcfLoad(q)})},120);
  return {h:h.replace(/data-act="word" data-k="/g,'data-rk="'),kind}}
async function rAyImg(g){try{const[si,a]=sa(g);try{await document.fonts.load('60px "KFGQPC Hafs"')}catch(e){}const W=1080,fs=54,F=`${fs}px "KFGQPC Hafs","Amiri Quran",serif`;const c=document.createElement("canvas");let x=c.getContext("2d");x.font=F;
  const words=(Q.v[g]+" "+AR_D(a)).split(" ");const L=[];let cur="";words.forEach(w=>{const t=cur?cur+" "+w:w;if(x.measureText(t).width>W-170&&cur){L.push(cur);cur=w}else cur=t});if(cur)L.push(cur);
  const lh=fs*2.05,H=Math.round(L.length*lh+330);c.width=W;c.height=H;x=c.getContext("2d");x.fillStyle="#101828";x.fillRect(0,0,W,H);x.strokeStyle="rgba(245,197,71,.55)";x.lineWidth=3;x.strokeRect(36,36,W-72,H-72);
  x.direction="rtl";x.textAlign="center";x.fillStyle="#f5c547";x.font='700 40px "Cairo",sans-serif';x.fillText(`سورة ${Q.s[si][0]}`,W/2,120);
  x.fillStyle="#ffffff";x.font=F;L.forEach((l,i)=>x.fillText(l,W/2,200+i*lh+fs));x.fillStyle="rgba(255,255,255,.6)";x.font='30px "Cairo",sans-serif';x.fillText(`${Q.s[si][0]}: ${AR_D(a)} · صفحة ${AR_D(pageOf(g))}`,W/2,H-70);
  const bl=await new Promise(r=>c.toBlob(r,"image/png"));const u=URL.createObjectURL(bl);const A_=document.createElement("a");A_.href=u;A_.download=`${Q.s[si][0]}-${a}.png`;document.body.appendChild(A_);A_.click();A_.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast("تم حفظ صورة الآية")}catch(e){toast("تعذّر حفظ الصورة")}}
function rFind(q){const rn=x=>zNorm(x).replace(/[اءٔإأآ]/g,"");if(!RD.vw)RD.vw=Q.v.map(v=>v.split(" ").map(rn));const qw=rn(q).split(/\s+/).filter(Boolean);const m=qw.length,out=[];if(!m)return out;
  const PF=/^(?:و|ف|ب|ك|ل|ال|وال|فال|بال|كال|لل|ول|فل|وب|فب|س|وس|فس)?$/;
  for(let g=0;g<RD.vw.length;g++){const W=RD.vw[g];for(let i=0;i+m<=W.length;i++){let ok;if(m===1)ok=W[i].includes(qw[0]);else{const f=W[i];ok=(f===qw[0]||(f.endsWith(qw[0])&&PF.test(f.slice(0,f.length-qw[0].length))))&&W[i+m-1].startsWith(qw[m-1]);for(let k=1;ok&&k<m-1;k++)ok=W[i+k]===qw[k]}if(ok){out.push([g,[i,i+m-1]]);break}}}return out}
function rSrRow(g,h){const[si,a]=sa(g);const w=Q.v[g].split(" ");const tx=h?w.map((x,i)=>i>=h[0]&&i<=h[1]?`<mark>${esc(x)}</mark>`:esc(x)).join(" "):esc(Q.v[g]);return `<button class="ix-sr" data-ract="goG" data-v="${g}"><span class="ix-srh"><b>${esc(Q.s[si][0])}: ${AR_D(a)}</b><em>${AR_D(pageOf(g))}</em></span><p class="ix-sq ${h?"":"all"}">${tx}</p></button>`}
function rSheetHTML(){const s=RD.sheet;if(!s)return"";let t="",b="";const pg=RD.pg;
  if(s==="idx"){t="";const curS=sa(Q.p[pg-1])[0];const cj=juzOf(Q.p[pg-1]);const M=RD.idx||"s";
    const seg=`<div class="rd-seg rd-seg3 rd-hseg">${[["s","السورة"],["j","الجزء"],["r","الربع"]].map(([k,l])=>`<button class="${M===k?"on":""}" data-ract="idxTab" data-v="${k}">${l}</button>`).join("")}</div>`;RD.hseg=seg;
    if(M==="s")b=`<div class="rd-list rd-grp">${Q.s.map((x,i)=>rSurLi(i,pg,curS===i)).join("")}</div>`;
    else if(M==="j"){b="";for(let j=0;j<30;j++){const st=Q.j[j],en=j<29?Q.j[j+1]-1:Q.v.length-1;const s0=sa(st)[0],s1=sa(en)[0];let L=[];for(let i=s0;i<=s1;i++)L.push(i);b+=`<h4 class="rd-jh ${cj===j+1?"cur":""}" id="rd-j${j+1}">الجزء ${AR_D(j+1)}</h4><div class="rd-list rd-grp">${L.map(i=>{const p=i===s0?pageOf(st):pageOf(Q.ss[i]);return `<button class="rd-li rd-sli" data-ract="go" data-v="${p}"><i>${AR_D(i+1)}</i><span><b>${esc(Q.s[i][0])}</b><small>${rMk(i)?"مكية":"مدنية"} · ${AR_D(Q.s[i][1])} آية</small></span><em>${AR_D(p)} ‹</em></button>`}).join("")}</div>`}}
    else{b="";for(let j=0;j<30;j++){b+=`<h4 class="rd-jh ${cj===j+1?"cur":""}" id="rd-j${j+1}">الجزء ${AR_D(j+1)}</h4><div class="rd-list rd-grp">`;for(let q=0;q<8;q++){const k=j*8+q;const g=RRUB[k];const f=(q%4+1)/4;const hz=q%4===0?AR_D(j*2+q/4+1):"";b+=`<button class="rd-li rd-rli" data-ract="goG" data-v="${g}"><i class="rd-ri">${rRing(q%4===0?1:(q%4)/4,hz)}</i><span><b>${rSnip(g,7)}</b><small>${esc(rSA(g))}</small></span><em>${AR_D(pageOf(g))} ‹</em></button>`}b+=`</div>`}}
    RD.jbar=`<nav class="rd-jbar">${Array.from({length:30},(_,j)=>`<button data-ract="jumpJ" data-v="${j+1}" class="${cj===j+1?"on":""}">${AR_D(j+1)}</button>`).join("")}</nav>`}
  else if(s==="srch"){t="البحث";const q=rDig((RD.q||"").trim());let res="";
    if(q){const R=[];const rn=x=>zNorm(x).replace(/[اءٔإأآ]/g,"");const CH=zSV('<path d="M15 6l-6 6 6 6"/>');
      const mm=q.match(/^(.*?)[\s:،,]*([0-9]+)$/);
      if(/^[0-9]+$/.test(q)){const n=+q;if(n>=1&&n<=604)R.push(`<button class="rd-li" data-ract="go" data-v="${n}"><i>${zSV('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8"/>')}</i><span><b>الصفحة ${AR_D(n)}</b><small>${esc(Q.s[sa(Q.p[n-1])[0]][0])}</small></span><em>${CH}</em></button>`);if(n>=1&&n<=114)R.push(rSurLi(n-1,0,false));if(n>=1&&n<=30)R.push(`<button class="rd-li" data-ract="go" data-v="${pageOf(Q.j[n-1])}"><i>${AR_D(n)}</i><span><b>الجزء ${AR_D(n)}</b><small>${esc(JUZ_NAMES[n-1])}</small></span><em>${AR_D(pageOf(Q.j[n-1]))}</em></button>`)}
      let one="";if(mm&&mm[1]){const nm=rn(mm[1].replace(/^سورة\s*/,""));const si=Q.s.findIndex(x=>rn(x[0])===nm)>=0?Q.s.findIndex(x=>rn(x[0])===nm):Q.s.findIndex(x=>rn(x[0]).includes(nm));const a=+mm[2];if(si>=0&&a>=1&&a<=Q.s[si][1]){const g=Q.ss[si]+a-1;one=rSrRow(g,null)}}
      let sr="",found="";if(!/^[0-9]+$/.test(q)){const nq=rn(q.replace(/^سورة\s*/,""));Q.s.forEach((x,i)=>{if(nq.length&&rn(x[0]).includes(nq))R.push(rSurLi(i,0,false))});
        if(q.length>1){const M=rFind(q);if(M.length){const N=M.length;found=`<h4 class="ix-cnt">${N===1?"آية واحدة":N===2?"آيتان":AR_D(N)+" "+(N<11?"آيات":"آية")}</h4><div class="ix-card ix-res">${M.slice(0,RD.srN||120).map(([g,h])=>rSrRow(g,h)).join("")}</div>${N>(RD.srN||120)?`<button class="ix-t ix-a ix-w ix-mr" data-ract="srMore"><span><b>عرض المزيد</b></span></button>`:""}`}}}
      if(one)R.unshift(`<div class="ix-card ix-res">${one}</div>`);
      res=R.length||found?(R.length?`<div class="rd-list">${R.join("")}</div>`:"")+found:`<p class="rd-empty"><b>لا نتائج</b><small>جرّب كلمة أخرى أو رقم صفحة</small></p>`}
    b=`<div class="ix-sf"><i>${zSV('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>')}</i><input id="rd-q" type="text" placeholder="السور والآيات والصفحات" value="${esc(RD.q||"")}" enterkeyhint="search" autocomplete="off" spellcheck="false"><button class="ix-clr" data-ract="clrQ" aria-label="مسح" ${RD.q?"":"hidden"}>${zSV('<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M9 9l6 6M15 9l-6 6" stroke="var(--rd-card)" stroke-width="2.4"/>')}</button></div>`+res}
  else if(s==="lib"&&RD.g!=null){const g=RD.g;const[si,a]=sa(g);t="المكتبة";RD.libBar=`<div class="rd-libbar"><button class="rd-ic" data-ract="libNav" data-v="-1" ${g<=0?"disabled":""} aria-label="الآية السابقة">${zSV('<path d="M9 6l6 6-6 6"/>')}</button><b>${esc(rSA(g))}</b><button class="rd-ic" data-ract="libNav" data-v="1" ${g>=Q.v.length-1?"disabled":""} aria-label="الآية التالية">${zSV('<path d="M15 6l-6 6 6 6"/>')}</button></div>`;
    b=`<div class="rd-libay"><p class="rd-ay">${esc(Q.v[g])} <span class="rd-an">${AR_D(a)}</span></p></div>`+RTAF.map(([k,l])=>{const tf=RD.tf[k+":"+g];if(tf===undefined)rTafsir(k,si+1,a,g);return `<h4 class="rd-h">${l}</h4><div class="rd-card"><p class="rd-tf">${tf==null?"جاري التحميل…":tf===false?"تعذّر التحميل الآن.":esc(tf)}</p></div>`}).join("")+`<p class="muted small">التفاسير من مستودع tafsir_api المفتوح.</p>`}
  else if(s==="today"){t="اليوم";const d=new Date();let hd="",hm="";try{hd=new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura",{day:"numeric"}).format(d);hm=new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura",{month:"long"}).format(d)}catch(e){}
    const seed=+zYmd(d).replace(/-/g,"");const g=(seed*7919)%Q.v.length;b=`<div class="rd-days"><div><small>${esc(hm)}</small><b>${esc(hd)}</b></div><div><small>${d.toLocaleDateString("ar-SA-u-ca-gregory",{month:"long"})}</small><b>${d.toLocaleDateString("ar-SA-u-ca-gregory",{day:"numeric"})}</b></div></div>
    <h4 class="rd-h">آية اليوم</h4><div class="rd-card"><p class="rd-ay">${esc(Q.v[g])} <span class="rd-an">${AR_D(sa(g)[1])}</span></p><small class="muted">${esc(rSA(g))}</small><div class="rd-row"><button class="rd-btn" data-ract="goG" data-v="${g}">اذهب للآية</button><button class="rd-btn" data-ract="lib" data-v="${g}">التفسير</button></div></div>`}
  else if(s==="kh"){t="الختمة";const K=zls.get("rk:"+rU(),null);
    if(!K)b=`<p class="muted">اختر مدة الختمة، ويُقسَّم المصحف على الأيام مع ورد يومي.</p><div class="kh-days">${KH_DAYS.map(d=>`<button class="${(RD.khd||30)===d?"on":""}" data-ract="khd" data-v="${d}"><b>${d}</b><small>يوماً</small><i>${Math.ceil(604/d)} ص/يوم</i></button>`).join("")}<button class="${RD.khd==="c"?"on":""}" data-ract="khd" data-v="c"><b>✎</b><small>مخصصة</small><i>نطاق وأيام</i></button></div>${RD.khd==="c"?khCustomHTML():""}<button class="rd-btn pri wide" data-ract="khStart">ابدأ الختمة</button>`;
    else{const R=khRows(K);const t0=today();let idx=R.findIndex(r=>r.date===t0);if(idx<0)idx=t0>R[R.length-1].date?R.length-1:0;const firstOpen=R.findIndex(r=>!K.done[r.i]);const cur=R[firstOpen>=0?firstOpen:idx];const late=R.filter(r=>r.date<t0&&!K.done[r.i]).length;
      const vs=p=>Q.p[p-1],ve=p=>(p<604?Q.p[p]:Q.v.length)-1;const snip=g=>esc(Q.v[g].split(" ").slice(0,6).join(" "));
      b=`${khIsCustom(K)?`<p class="muted small">ختمة مخصصة: ${esc(khRangeTxt(K))} · ${AR_D(R.length)} ورداً</p>`:""}<h4 class="rd-h">ورد اليوم ${AR_D(cur.i)}</h4>${late?`<p class="rd-late">متأخر بـ ${AR_D(late)} ${late>2&&late<11?"أيام":"يوماً"}</p>`:`<p class="rd-ok">على الموعد ✓</p>`}
      <div class="rd-card rd-wird"><button class="rd-wl" data-ract="goG" data-v="${vs(cur.from)}"><span><b>من ${esc(rSA(vs(cur.from)))}</b><small>${snip(vs(cur.from))}</small></span><em>${AR_D(cur.from)} ‹</em></button><button class="rd-wl" data-ract="goG" data-v="${ve(cur.to)}"><span><b>إلى ${esc(rSA(ve(cur.to)))}</b><small>${snip(ve(cur.to))}</small></span><em>${AR_D(cur.to)} ‹</em></button></div>
      <button class="rd-btn pri wide" data-ract="khDone" data-v="${cur.i}">${K.done[cur.i]?"✓ مكتمل":"تمييز كمكتمل"}</button>
      <details class="rd-card"><summary>كل الأوراد <span class="muted">${AR_D(Object.keys(K.done).length)}/${AR_D(R.length)}</span></summary><div class="rd-list">${R.map(r=>`<button class="rd-li ${K.done[r.i]?"done":""}" data-ract="go" data-v="${r.from}"><i>${K.done[r.i]?"✓":AR_D(r.i)}</i><span><b>${esc(rSA(vs(r.from)))}</b><small>${esc(fmtShort(r.date))}</small></span><em>${AR_D(r.from)}–${AR_D(r.to)}</em></button>`).join("")}</div></details>
      <button class="rd-btn danger wide" data-ract="khDel">حذف الختمة</button>`}}
  else if(s==="bm"){t="الفواصل";const B=rBM();b=`<div class="rd-card">${RBM.map(([k,l,c])=>{const x=B[k];return `<div class="rd-bmr"><button class="rd-li" data-ract="${x?"goG":"noop"}" data-v="${x?x.g:""}"><i class="rd-bmi" style="color:${c}">${zSV('<path d="M6 3h12v18l-6-4-6 4z" fill="currentColor"/>')}</i><span><b>${l}</b><small>${x?`${esc(fmtShort(x.at.slice(0,10)))} · ${esc(rSA(x.g))}`:"غير مستخدم — اضغط على آية لوضعه"}</small></span>${x?`<em>${AR_D(pageOf(x.g))} ‹</em>`:""}</button>${x&&RD.bmEdit?`<button class="rd-x" data-ract="bmDel" data-v="${k}">✕</button>`:""}</div>`}).join("")}</div>`}
  else if(s==="hl"){t="التمييزات";const H=rHL();const L=Object.entries(H).map(([g,c])=>[+g,c]).sort((a,b)=>a[0]-b[0]);const hs=rHeatSid();let hp=[];try{if(hs)hp=heatPages(heatMap(hs)).slice(0,30)}catch(e){}const hpH=hp.length?`<h4 class="rd-h">مواضع أخطاء التسميع</h4><p class="muted small">الصفحات الأكثر تنبيهاً وتلقيناً — راجعها أولاً</p><div class="rd-list">${hp.map(([p,n])=>{const g=Q.p[p-1];return `<button class="rd-li" data-ract="go" data-v="${p}"><i class="rd-ern">${AR_D(n)}</i><span><b>صفحة ${AR_D(p)}</b><small>${esc(rSA(g))}</small></span><em>‹</em></button>`}).join("")}</div><h4 class="rd-h">تمييزاتي</h4>`:"";const by=RD.hlBy||"s";const grp=L.length?`<div class="rd-seg rd-hseg2">${[["s","السورة"],["c","اللون"]].map(([k,l])=>`<button class="${by===k?"on":""}" data-ract="hlBy" data-v="${k}">${l}</button>`).join("")}</div>`:"";if(by==="c")L.sort((x,y)=>RHL.findIndex(r=>r[0]===x[1])-RHL.findIndex(r=>r[0]===y[1])||x[0]-y[0]);let lastK=null;b=hpH+grp+(L.length?`<div class="rd-list">${L.map(([g,c])=>{const kk=by==="c"?c:sa(g)[0];const hd=kk!==lastK?`<h4 class="rd-jh">${by==="c"?esc((RHL.find(r=>r[0]===c)||[,"لون"])[1]):"سورة "+esc(Q.s[sa(g)[0]][0])}</h4>`:"";lastK=kk;return hd+`<div class="rd-bmr"><button class="rd-li" data-ract="goG" data-v="${g}"><i class="rd-dot" style="background:${c}"></i><span><b>${esc(rSA(g))}</b><small>${esc(Q.v[g].split(" ").slice(0,8).join(" "))}…</small></span><em>${AR_D(pageOf(g))} ‹</em></button><button class="rd-x" data-ract="hlDel" data-v="${g}">✕</button></div>`}).join("")}</div>`:`<p class="rd-empty"><b>لا توجد تمييزات</b><small>المس أي آية ثم اختر لون التمييز</small></p><p class="muted" hidden>لا توجد تمييزات بعد. اضغط على أي آية واختر لوناً من «التمييز».</p>`)}
  else if(s==="rc"){t="القارئ";b=`<div class="rd-list">${RECITERS.map(([k,l])=>`<button class="rd-li ${plRc()===k?"cur":""}" data-ract="rcPick" data-v="${k}"><i>${plRc()===k?"✓":zSV('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')}</i><span><b>${esc(l)}</b><small>${plRc()===k?"القارئ الحالي":"اضغط للاختيار"}</small></span></button>`).join("")}</div><p class="muted small">التلاوات من موقع everyayah.com وتُحمَّل آية بآية أثناء التشغيل.</p>`}
  else if(s==="set"){t="الإعدادات";const tm=getThemeMode?getThemeMode():"system";const fs=!!document.fullscreenElement;
    b=`<h4 class="rd-h">التلاوة</h4><div class="rd-row"><button class="rd-btn" data-ract="playPage">${ICON.play} تشغيل الصفحة</button><button class="rd-btn" data-ract="repFrom">تشغيل إلى / تكرار ‹</button></div>${PL.on?`<button class="rd-btn danger wide" data-ract="stop">إيقاف التلاوة</button>`:""}
    <label class="rd-f"><span>القارئ</span><select class="rd-sel" data-rchange="rc">${RECITERS.map(([k,l])=>`<option value="${k}" ${plRc()===k?"selected":""}>${esc(l)}</option>`).join("")}</select></label>
    <label class="rd-f"><span>التفسير الافتراضي</span><select class="rd-sel" data-rchange="tfSrc">${RTAF.map(([k,l])=>`<option value="${k}" ${k===(RD.tfSrc||zls.get("rtaf",RTAF[0][0]))?"selected":""}>${l}</option>`).join("")}</select></label>
    <h4 class="rd-h">الحفظ</h4><div class="rd-card rd-tg"><span><b>وضع الحفظ</b><small class="muted">تُخفى الآيات، والمس أي كلمة لإظهارها وتختبر حفظك</small></span><button class="rd-sw ${RD.mem?"on":""}" data-ract="memTg" aria-label="وضع الحفظ"><i></i></button></div><h4 class="rd-h">القراءة بدون إنترنت</h4><div class="rd-card rd-off"><span><b>${zls.get("offdone",0)?"المصحف محفوظ على هذا الجهاز ✓":"حفظ المصحف كاملاً على هذا الجهاز"}</b><small class="muted" id="rd-offp">${RD.offRun?"جارٍ التنزيل…":zls.get("offdone",0)?"تقدر تقرأ أي صفحة حتى بدون اتصال.":"تقريباً ٥٠ ميجابايت · يُفضّل على شبكة Wi‑Fi. الصفحات اللي تفتحها تنحفظ تلقائياً."}</small></span><button class="rd-btn" data-ract="offDl" ${RD.offRun?"disabled":""}>${zls.get("offdone",0)?"تحديث":"تنزيل"}</button></div>
    <h4 class="rd-h">أخطاء التسميع</h4><div class="rd-card rd-tg"><span><b>إظهار مواضع التنبيه والتلقين</b><small class="muted">${rHeatSid()?"تظهر الكلمات اللي نبّهك عليها المعلم بالأصفر، واللي لُقّنتها بالأحمر":"تظهر للطالب وولي الأمر، وللمعلم عند اختيار طالب في صفحة المصحف"}</small></span><button class="rd-sw ${zls.get("rheat",true)!==false?"on":""}" data-ract="heatTg" aria-label="إظهار الأخطاء"><i></i></button></div>
    <h4 class="rd-h">المظهر</h4><div class="rd-seg rd-seg3">${[["light","نهاري"],["dark","ليلي"],["system","تلقائي"]].map(([k,l])=>`<button class="${(tm||"system")===k?"on":""}" data-ract="theme" data-v="${k}">${l}</button>`).join("")}</div>
    <h4 class="rd-h">العرض</h4><div class="rd-row"><button class="rd-btn" data-ract="fs">${fs?"الخروج من ملء الشاشة":"ملء الشاشة"}</button><button class="rd-btn" data-ract="sheet" data-v="idx">الانتقال لسورة/جزء ‹</button></div>
    <label class="rd-f"><span>الانتقال لصفحة</span><div class="rd-go"><input class="rd-sel" id="rd-pg" type="number" min="1" max="604" value="${pg}" inputmode="numeric"><button class="rd-btn pri" data-ract="goPg">اذهب</button></div></label>
    <p class="muted small">التقليب: اسحب يميناً ويساراً، أو اضغط على طرفي الشاشة. ضغطة على مكان فارغ تخفي الأزرار. اضغط على أي آية لخيارات الفواصل والتلاوة والتفسير والتمييز.</p>`}
  else if(s==="ayah"&&RD.g!=null){const g=RD.g;const[si,a]=sa(g);t=rSA(g);const B=rBM();const H=rHL();const src=RD.tfSrc||zls.get("rtaf",RTAF[0][0]);const tk=src+":"+g;const tf=RD.tf[tk];if(tf===undefined)rTafsir(src,si+1,a,g);
    const CH=zSV('<path d="M15 6l-6 6 6 6"/>');const lk=zls.get("rbmLast:"+rU(),"yellow");const LB=RBM.find(r=>r[0]===lk)||RBM[1];const lx=B[LB[0]];const lst=lx?(lx.g===g?"هذه الآية":rSA(lx.g)):"غير مستخدم";
    const tft=tf==null?"جاري التحميل…":tf===false?"تعذّر تحميل التفسير الآن.":tf;const tshort=typeof tf==="string"&&tf.length>150?esc(tf.slice(0,150).replace(/\s+\S*$/,""))+` <button class="ix-more" data-ract="lib" data-v="${g}">... متابعة القراءة</button>`:esc(tft);
    const SEC={
      bm:["الفواصل",`<div class="ix-r ix-2"><button class="ix-t" data-ract="bmSet" data-v="${LB[0]}"><i style="color:${LB[2]}">${zSV('<path d="M6 3h12v18l-6-4-6 4z" fill="currentColor" stroke="none"/>')}</i><span><b>${LB[1]}</b><small style="color:${LB[2]}">${esc(lst)}</small></span></button><button class="ix-t ix-a" data-ract="sheet" data-v="bm"><i>${zSV('<path d="M4 6h11M4 12h11M4 18h11"/><circle cx="19.5" cy="6" r="1.3" fill="currentColor"/><circle cx="19.5" cy="12" r="1.3" fill="currentColor"/><circle cx="19.5" cy="18" r="1.3" fill="currentColor"/>')}</i><span><b>الكل</b></span><em>${CH}</em></button></div>`],
      tl:["التلاوة",`<div class="ix-r ix-2"><button class="ix-t ix-a" data-ract="playG" data-v="${g}"><i>${zSV('<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>')}</i><span><b>تشغيل</b></span></button><button class="ix-t ix-a" data-ract="repFrom"><i>${zSV('<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>')}</i><span><b>تشغيل إلى</b></span><em>${CH}</em></button></div>`],
      tf:["التفسير",`<div class="ix-card ix-tf"><p>${tshort}</p></div><button class="ix-t ix-a ix-w" data-ract="lib" data-v="${g}"><i>${zSV('<path d="M4 4h3.2v16H4zM9 4h3.2v16H9z" fill="currentColor" stroke="none"/><path d="M14.3 5.2l3-.9 3.9 15.1-3 .9z" fill="currentColor" stroke="none"/>')}</i><span><b>المكتبة</b></span><em>${CH}</em></button>`],
      sh:["المشاركة",`<div class="ix-r ix-3"><button class="ix-t ix-a" data-ract="shareAy" data-v="${g}"><i>${zSV('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/>')}</i><span><b>مشاركة</b></span><em>${CH}</em></button><button class="ix-t ix-a ix-c" data-ract="saveImg" data-v="${g}" aria-label="حفظ صورة الآية"><i>${zSV('<path d="M12 3v11M8 10l4 4 4-4"/><path d="M5 14v6h14v-6"/>')}</i></button><button class="ix-t ix-a ix-c" data-ract="copyAy" data-v="${g}" aria-label="نسخ الآية"><i>${zSV('<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2"/><path d="M11 13h6M11 16h4"/>')}</i></button></div>`],
      hl:["التمييز",`<div class="ix-card ix-hls">${RHL.map(([c,l])=>`<button class="${(H[g]||"")===c?"on":""}" data-ract="hlSet" data-v="${c}" title="${l}" aria-label="${l}" style="--c:${c||"transparent"}">${c?"":zSV('<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>')}</button>`).join("")}</div>`]};
    let ord=zls.get("rayord",null);const K0=["bm","tl","tf","sh","hl"];if(!Array.isArray(ord)||ord.length!==5||!K0.every(k=>ord.includes(k)))ord=K0;
    b=`<div class="ix">${ord.map((k,n)=>`<section class="ix-s"><h4 class="ix-h"><span>${SEC[k][0]}</span>${RD.ayEd?`<span class="ix-mv"><button data-ract="ayMv" data-v="${k}:-1" ${n?"":"disabled"} aria-label="لأعلى">${zSV('<path d="M6 15l6-6 6 6"/>')}</button><button data-ract="ayMv" data-v="${k}:1" ${n<4?"":"disabled"} aria-label="لأسفل">${zSV('<path d="M6 9l6 6 6-6"/>')}</button></span>`:""}</h4>${SEC[k][1]}</section>`).join("")}</div>`}
  else if(s==="rep"){t="التكرار";const g0=RD.g!=null?RD.g:(PL.on&&PL.q[PL.i]?Q.ss[PL.q[PL.i][0]-1]+PL.q[PL.i][1]-1:Q.p[pg-1]);if(RD.rF==null){RD.rF=g0;const[si,a]=sa(g0);RD.rT=Math.min(Q.ss[si]+Q.s[si][1]-1,g0+4)}if(RD.rT<RD.rF)RD.rT=RD.rF;
    const pick=(w,g)=>{const[si,a]=sa(g);return `<div class="rr-pick"><select class="rd-sel" data-rchange="r${w}S">${Q.s.map(([n],i)=>`<option value="${i}" ${i===si?"selected":""}>${i+1}. ${esc(n)}</option>`).join("")}</select><select class="rd-sel" data-rchange="r${w}A">${Array.from({length:Q.s[si][1]},(_,i)=>`<option value="${i+1}" ${i+1===a?"selected":""}>${AR_D(i+1)}</option>`).join("")}</select></div>`};
    const cnt=(k,v)=>`<div class="rr-cnt">${[2,3,5,7,10,9999].map(n=>`<button class="${v===n?"on":""}" data-ract="rrN" data-v="${k}:${n}">${n>=9999?"∞":AR_D(n)}</button>`).join("")}</div>`;
    const r1=RD.r1||1,r2=RD.r2||1;
    b=`<h4 class="rd-h rr-h">المقطع</h4><div class="rr-card"><button class="rr-row" data-ract="rrOpen" data-v="F"><span>من</span><b>${esc(rSA(RD.rF))}</b></button>${RD.rOpen==="F"?pick("F",RD.rF):""}<i class="rr-sep"></i><button class="rr-row" data-ract="rrOpen" data-v="T"><span>إلى</span><b>${esc(rSA(RD.rT))}</b></button>${RD.rOpen==="T"?pick("T",RD.rT):""}</div>
    <div class="rr-card rr-tg"><div class="rr-row"><span>تكرار المقطع</span><button class="rd-sw ${r2>1?"on":""}" data-ract="rrTg" data-v="2" aria-label="تكرار المقطع"><i></i></button></div>${r2>1?cnt(2,r2):""}</div>
    <div class="rr-card rr-tg"><div class="rr-row"><span>تكرار الآية</span><button class="rd-sw ${r1>1?"on":""}" data-ract="rrTg" data-v="1" aria-label="تكرار الآية"><i></i></button></div>${r1>1?cnt(1,r1):""}</div>
    <label class="rd-f rr-rc"><span>القارئ</span><select class="rd-sel" id="rd-rc" data-rchange="rc">${RECITERS.map(([k,l])=>`<option value="${k}" ${plRc()===k?"selected":""}>${esc(l)}</option>`).join("")}</select></label>
    <button class="rd-btn pri wide" data-ract="repStart">${ICON.play} تشغيل المقطع</button>${PL.on?`<button class="rd-btn wide" data-ract="stop">إيقاف التلاوة</button>`:""}`}
  const isTab=RTABS.includes(s);const right=s==="bm"?`<button class="rd-pill" data-ract="bmEdit">${RD.bmEdit?"تم":"تعديل"}</button>`:s==="ayah"?`<button class="rd-pill" data-ract="ayEd">${RD.ayEd?"تم":"إعادة الترتيب"}</button>`:isTab?`<button class="rd-pill" data-ract="close">خروج</button>`:`<span class="rd-hsp"></span>`;const mid=s==="idx"?RD.hseg:`<b>${esc(t)}</b>`;const lb=s==="lib"?RD.libBar:s==="idx"?RD.jbar:"";
  return `<div class="rd-sbg" data-ract="closeSheet"></div><section class="rd-sheet rd-sh-${s}" role="dialog" aria-label="${esc(t||"الفهرس")}"><header>${right}${mid}<button class="rd-ic rd-back" data-ract="closeSheet" aria-label="رجوع">${isTab?zSV('<path d="M15 6l-6 6 6 6"/>'):zSV('<path d="M6 6l12 12M18 6L6 18"/>')}</button></header><div class="rd-sb">${b}</div>${lb}</section>`}
const RTAF_ALT={"ar-tafsir-muyassar":["ara-kingfahadquranc","التفسير الميسر"]};
async function rTafsir(src,s,a,g){const k=src+":"+g;RD.tf[k]=null;const get1=async u=>{const r=await fetch(u);if(!r.ok)throw 0;const j=await r.json();const t=String(j.text||"").trim();if(!t)throw 0;return t};
  try{RD.tf[k]=await get1(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${src}/${s}/${a}.json`)}
  catch(e){try{const alt=RTAF_ALT[src]||RTAF_ALT["ar-tafsir-muyassar"];const t=await get1(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${alt[0]}/${s}/${a}.json`);RD.tf[k]=RTAF_ALT[src]?t:`${t}\n\n(من ${alt[1]} — المصدر الأساسي غير متاح الآن)`}catch(e2){RD.tf[k]=false}}
  if(RD.on&&(RD.sheet==="ayah"||RD.sheet==="lib")&&RD.g===g)rRender(true)}

function rHeatSid(){try{const m=me();if(!m)return null;if(m.role==="student")return m.id;if(m.role==="parent"){const k=ui.kid||(m.childIds||[])[0];return k||null}if(isStaff(m))return ui.mheat||null}catch(e){}return null}
function rApplyHeat(o){if(zls.get("rheat",true)===false)return{t:0,l:0};const sid=rHeatSid();if(!sid)return{t:0,l:0};let M;try{M=heatMap(sid)}catch(e){return{t:0,l:0}}const c={t:0,l:0};
  o.querySelectorAll(".rd-page [data-rk]").forEach(w=>{const x=M[w.dataset.rk];if(!x)return;const red=x.l>0;w.classList.add(red?"rd-mk-l":"rd-mk-t");w.title=[x.t?`تنبيه ×${x.t}`:"",x.l?`تلقين ×${x.l}`:""].filter(Boolean).join(" · ")+(x.last?` · آخرها ${fmtShort(x.last)}`:"");c[red?"l":"t"]++});return c}

/* ===== مشغل التلاوة داخل المصحف ===== */
const rRcName=()=>(RECITERS.find(r=>r[0]===plRc())||RECITERS[0])[1];
const rFmtT=s=>{s=Math.max(0,Math.floor(s||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`};
function rPlayerHTML(){const a=document.getElementById("qplayer");
  if(!PL.on)return `<div class="rp-pill"><button class="rp-play" data-ract="pStart" aria-label="تشغيل">${zSV('<path d="M7 4l13 8-13 8z" fill="currentColor"/>')}</button><button class="rp-name" data-ract="sheet" data-v="rc">${esc(rRcName())}</button></div>`;
  const it=PL.q[PL.i]||[];const paused=a&&a.paused;const rate=PL.rate||1;const rep=PL.rep||1;
  return `<div class="rp-card"><div class="rp-h"><button class="rp-x" data-ract="pStop" aria-label="إيقاف">✕</button><button class="rp-t" data-ract="sheet" data-v="rc"><b>${esc(rRcName())}</b><small>${it[0]?`${esc(Q.s[it[0]-1][0])}: ${AR_D(it[1])}`:""}</small></button><span class="rp-sp"></span></div>
   <div class="rp-bar"><span class="rp-cur">${rFmtT(a&&a.currentTime)}</span><i><em class="rp-fill" style="width:${a&&a.duration?Math.round(a.currentTime/a.duration*100):0}%"></em></i><span class="rp-dur">-${rFmtT(a&&a.duration?a.duration-a.currentTime:0)}</span></div>
   <div class="rp-c"><button class="rp-s ${rep>1?"on":""}" data-ract="pRep" aria-label="تكرار الآية">${zSV('<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>')}${rep>1?`<sub>${rep>=9999?"∞":AR_D(rep)}</sub>`:""}</button>
   <button class="rp-s" data-ract="pPrev" aria-label="الآية السابقة">${zSV('<path d="M11 6l-7 6 7 6zM20 6l-7 6 7 6z" fill="currentColor"/>')}</button>
   <button class="rp-pp" data-ract="pToggle" aria-label="${paused?"تشغيل":"إيقاف مؤقت"}">${paused?zSV('<path d="M7 4l13 8-13 8z" fill="currentColor"/>'):zSV('<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>')}</button>
   <button class="rp-s" data-ract="pNext" aria-label="الآية التالية">${zSV('<path d="M13 6l7 6-7 6zM4 6l7 6-7 6z" fill="currentColor"/>')}</button>
   <button class="rp-s rp-rate" data-ract="pRate" aria-label="السرعة">${rate}x</button></div></div>`}
function rPlayerUpdate(){const el=document.querySelector("#mreader .rd-player");if(el)el.innerHTML=rPlayerHTML();const o=document.getElementById("mreader");if(o)o.classList.toggle("rd-playing",!!PL.on)}
(function(){let bound=false;const bind=()=>{const a=document.getElementById("qplayer");if(!a||bound)return;bound=true;
  a.addEventListener("timeupdate",()=>{if(!RD.on)return;const f=document.querySelector("#mreader .rp-fill");if(!f)return;f.style.width=(a.duration?a.currentTime/a.duration*100:0)+"%";const c=document.querySelector("#mreader .rp-cur"),d=document.querySelector("#mreader .rp-dur");if(c)c.textContent=rFmtT(a.currentTime);if(d)d.textContent="-"+rFmtT(a.duration?a.duration-a.currentTime:0)});
  a.addEventListener("loadedmetadata",()=>{try{a.playbackRate=PL.rate||1}catch(e){}});["play","pause"].forEach(ev=>a.addEventListener(ev,()=>{if(RD.on)rPlayerUpdate()}))};
  setInterval(bind,1000)})();

const rSpread=()=>{const e=RD.embedOn&&!RD.full&&RD.el;const W=e?RD.el.clientWidth||innerWidth:innerWidth,H=e?RD.el.clientHeight||innerHeight:innerHeight;return W>=900&&W>H*1.15};
function rPageBlock(pg,P){const from=Q.p[pg-1];const[si]=sa(from);const jz=juzOf(from);P=P||rPageHTML(pg);
  const hz=rRubOf(pg);
  return `<div class="rd-page ${pg%2?"rd-pr":"rd-pl"}"><div class="rd-ph"><span>الجزء ${AR_D(jz)}</span><span class="rd-clk">${rClock()}</span><span>${esc(Q.s[si][0])}</span></div><div class="mushaf ${P.kind} ${P.kind==="mqcf"&&pg<=2?"q-open":""} ${P.kind==="m15"&&pg<=2?"m-open":""} ${P.kind==="m15"&&pg===1?"m-p1":""}" data-kind="${P.kind}" lang="ar">${P.h}</div><div class="rd-pf"><span class="rd-lg" hidden></span><span class="rd-pn"><b>${AR_D(pg)}</b>${hz?`<i>${hz}</i>`:""}</span></div></div>`}
function rRubOf(pg){if(typeof RRUB==="undefined")return"";for(let k=0;k<RRUB.length;k++){const p=pageOf(RRUB[k]);if(p===pg){const q=k%4,h=Math.floor(k/4)+1;return (q?["","١/٤","١/٢","٣/٤"][q]+" ":"")+"الحزب "+AR_D(h)}if(p>pg)break}return""}
function rClock(){const d=new Date();let h=d.getHours()%12||12;return AR_D(h)+":"+AR_D(String(d.getMinutes()).padStart(2,"0"))}
setInterval(()=>{if(!RD.on)return;document.querySelectorAll("#mreader .rd-clk").forEach(e=>e.textContent=rClock())},20000);
function rPagesHTML(pg,P){if(!rSpread())return rPageBlock(pg,P);const a=pg%2?pg:pg-1,b=a+1;return `<div class="rd-spread">${rPageBlock(a,a===pg?P:null)}${b<=604?rPageBlock(b,b===pg?P:null):""}</div>`}

function rStripHTML(pg){const B=rBM();const bmp={};Object.entries(B).forEach(([k,x])=>{const p=pageOf(x.g);(bmp[p]=bmp[p]||[]).push((RBM.find(r=>r[0]===k)||[,,"#888"])[2])});const K=zls.get("rk:"+rU(),null);
  let h="";for(let p=Math.max(1,pg-40);p<=Math.min(604,pg+40);p++){const cur=p===pg;h+=`<button class="rd-th ${cur?"cur":""}" data-ract="go" data-v="${p}" aria-label="صفحة ${p}">${cur?`<i class="rd-thl"></i><b>${AR_D(p)}</b>`:`<i class="rd-thl"></i>`}${bmp[p]?`<em style="background:${bmp[p][0]}"></em>`:""}</button>`}return h}
function rRender(keepScroll){const o=document.getElementById("mreader");if(!o||!RD.on)return;if(RD.embedOn&&!RD.full&&!o.closest("#rd-host"))return;const pg=RD.pg;const from=Q.p[pg-1];const[si]=sa(from);const jz=juzOf(from);const P=rPageHTML(pg);const sb=o.querySelector(".rd-sb");const st=keepScroll&&sb?sb.scrollTop:0;
  if(RTABS.includes(RD.sheet))RD.lastTab=RD.sheet;const rTM=rTasmee();ui.mpage=pg;o.className=`rd ${RD.mem?"rd-mem":""} ${RD.embedOn&&!RD.full?"rd-embed":""} ${rTM?"rd-tm":""} ${RD.chrome?"":"rd-hide"} ${RD.sheet?"rd-has-sheet":""} ${RTABS.includes(RD.sheet)?"rd-tabs-on":""} ${PL.on?"rd-playing":""}`;
  o.innerHTML=`<header class="rd-top"><button class="rd-ic" data-ract="menu" aria-label="القوائم">${zSV('<path d="M4 6h11M4 12h11M4 18h11"/><circle cx="19.5" cy="6" r="1.2"/><circle cx="19.5" cy="12" r="1.2"/><circle cx="19.5" cy="18" r="1.2"/>')}</button><div class="rd-tt"><b>مصحف المدينة النبوية</b></div>${RD.embedOn&&!RD.full?`<button class="rd-ic rd-x4" data-ract="full" aria-label="ملء الشاشة">${zSV('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>')}</button>`:`<button class="rd-ic rd-x4" data-ract="close" aria-label="${RD.embedOn?"تصغير المصحف":"الخروج من المصحف"}">${zSV('<path d="M6 6l12 12M18 6L6 18"/>')}</button>`}<button class="rd-ic" data-ract="sheet" data-v="set" aria-label="الإعدادات">${zSV('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>')}</button></header>
  <div class="rd-stage ${RD._noFade?"":"rd-fitting"}"><button class="rd-nav nx" data-ract="nav" data-v="1" aria-label="الصفحة التالية" ${pg>=604?"disabled":""}>‹</button>${rPagesHTML(pg,P)}<button class="rd-nav pv" data-ract="nav" data-v="-1" aria-label="الصفحة السابقة" ${pg<=1?"disabled":""}>›</button></div>
  <footer class="rd-bot">${RD.mem?rMemBar():""}<div class="rd-player">${rPlayerHTML()}</div><div class="rd-strip-row"><div class="rd-sbub" hidden></div>${(()=>{const bp=RD.prev||RD.openPg||pg;return `<button class="rd-ic rd-bk ${bp===pg?"dim":""}" data-ract="back" aria-label="العودة للصفحة ${bp}" ${bp===pg?"disabled":""}>${zSV('<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>')}<small>${AR_D(bp)}</small></button>`})()}<div class="rd-strip" dir="rtl">${rStripHTML(pg)}</div><button class="rd-ic rd-sbtn" data-ract="search" aria-label="بحث">${zSV('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>')}</button></div>
  <nav class="rd-tabs">${[["idx","الفهرس",'<path d="M4 6h11M4 12h11M4 18h11"/><circle cx="19.5" cy="6" r="1.2"/><circle cx="19.5" cy="12" r="1.2"/><circle cx="19.5" cy="18" r="1.2"/>'],["today","اليوم",'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'],["kh","الختمة",'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>'],["bm","الفواصل",'<path d="M6 3h12v18l-6-4-6 4z"/>'],["hl","التمييزات",'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>']].map(([k,l,ic])=>`<button class="${RD.sheet===k?"on":""}" data-ract="tab" data-v="${k}">${zSV(ic)}<span>${l}</span></button>`).join("")}</nav></footer>${rTM&&RD.full&&!RD.sheet?rTmBar():""}${rTM&&ui.mpick&&!RD.sheet?`<div class="rd-pick">${pickerHTML()}</div>`:""}${rSheetHTML()}`;
  const H=rHL();o.querySelectorAll("[data-rk]").forEach(w=>{const g=+w.dataset.rk.split(":")[0];if(H[g])w.style.background=`color-mix(in srgb,${H[g]} 38%,transparent)`;if(g===RD.g)w.classList.add("rd-cur");if(g===RD.playG)w.classList.add("rd-play")});
  const hc=rApplyHeat(o);try{rMemApply(o)}catch(_){}const lg=o.querySelector(".rd-lg");if(lg){if(hc.t||hc.l){lg.innerHTML=`${hc.t?`<span class="t">تنبيه ${AR_D(hc.t)}</span>`:""}${hc.l?`<span class="l">تلقين ${AR_D(hc.l)}</span>`:""}`;lg.hidden=false}else lg.hidden=true}
  requestAnimationFrame(()=>{const pk=o.querySelector(".rd-pick");if(pk){const ws=o.querySelector(".rd-stage .wsel");const or=o.getBoundingClientRect();if(ws){const r=ws.getBoundingClientRect();pk.classList.toggle("top",(r.top+r.bottom)/2-or.top>or.height*.5)}}const th=o.querySelector(".rd-th.cur");if(th){const st=o.querySelector(".rd-strip");if(st){RD._stProg=true;RD._stIgn=Date.now()+900;st.style.scrollBehavior="auto";{const sr=st.getBoundingClientRect(),tr=th.getBoundingClientRect();st.scrollLeft+=(tr.left+tr.width/2)-(sr.left+sr.width/2)}o.scrollTop=0;st.style.scrollBehavior="";setTimeout(()=>{RD._stProg=false},120)}}rFitAll(o);clearTimeout(RD._rf2);RD._rf2=setTimeout(()=>{if(!RD.on||RD._drag)return;const m=o.querySelector(".rd-stage>.rd-page .mushaf");const f0=m&&m.style.fontSize;rFitAll(o);if(m&&m.style.fontSize!==f0){try{rAyHL(o)}catch(_){}try{rMkZ(o)}catch(_){}}},700);try{rAyHL(o)}catch(_){}try{rMkZ(o)}catch(_){}requestAnimationFrame(()=>{const sg=o.querySelector(".rd-stage");if(sg)sg.classList.remove("rd-fitting");try{rAyHL(o)}catch(_){}try{rMkZ(o)}catch(_){}rPreGhost();try{rMemApply(o)}catch(_){}})});
  RD._noFade=false;if(st){const nb=o.querySelector(".rd-sb");if(nb)nb.scrollTop=st}}
function rIdxScroll(){if(RD.sheet!=="idx")return;requestAnimationFrame(()=>{const sb=document.querySelector("#mreader .rd-sb");if(!sb)return;const c=sb.querySelector(".rd-jh.cur")||sb.querySelector(".rd-li.cur");if(c)sb.scrollTop=Math.max(0,c.offsetTop-90)})}
function rFitAll(o){o=o||document.getElementById("mreader");if(!o)return;const ms=[...o.querySelectorAll(".rd-stage .rd-page .mushaf")];ms.forEach(m=>{m.style.minHeight="";try{if(m.dataset.kind==="mqcf")fitQcf(m);else if(m.dataset.kind==="m15")fitMushaf(m)}catch(e){}});
  const st=o.querySelector(".rd-stage");if(!st)return;const cs=getComputedStyle(st);const SH=st.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  const availOf=m=>{const pgEl=m.closest(".rd-page");let extra=0;if(pgEl){const pc=getComputedStyle(pgEl);extra=parseFloat(pc.paddingTop)+parseFloat(pc.paddingBottom)+parseFloat(pc.borderTopWidth)+parseFloat(pc.borderBottomWidth);[...pgEl.children].forEach(c=>{if(c===m)return;const s2=getComputedStyle(c);if(s2.display==="none"||s2.position==="absolute")return;extra+=c.offsetHeight+parseFloat(s2.marginTop)+parseFloat(s2.marginBottom)});const s3=getComputedStyle(m);extra+=parseFloat(s3.marginTop)+parseFloat(s3.marginBottom)}return SH-extra-2};
  /* قياس المحتوى الفعلي وتصغير الخط حتى تظهر الصفحة كاملة */
  const need=m=>{m.style.setProperty("height","auto","important");return m.scrollHeight};
  const fit=(m,fs)=>{const av=availOf(m);if(av<120)return;for(let k=0;k<5;k++){m.style.fontSize=fs.toFixed(2)+"px";const n=need(m);if(n<=av+.5)break;fs=fs*Math.min(.995,av/n)}const n=need(m);m.style.setProperty("height",Math.max(n,Math.min(av,n*1.22)).toFixed(1)+"px","important");return fs};
  const qs=ms.filter(m=>m.dataset.kind==="mqcf"&&!m.classList.contains("q-open"));const F=qs.map(m=>fit(m,parseFloat(m.style.fontSize)||20));
  if(qs.length===2&&F[0]&&F[1]){const f=Math.min(F[0],F[1]);qs.forEach(m=>fit(m,f))}
  if(ms.length===2){const k=ms.filter(m=>m.dataset.kind==="m15"&&!m.classList.contains("m-open"));if(k.length===2){const f=Math.min(...k.map(m=>parseFloat(m.style.fontSize)||32));k.forEach(m=>m.style.fontSize=f.toFixed(2)+"px")}
    const h=Math.max(...ms.map(m=>m.offsetHeight));ms.forEach(m=>{m.style.minHeight=h+"px"})}}
try{document.fonts&&document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",()=>{if(RD.on)setTimeout(()=>rFitAll(),30)})}catch(e){}
/* تقليب الصفحات بالسحب مثل التطبيق: الصفحة تتبع الإصبع والتالية تدخل من الجانب */
function rGhost(n,dir){const o=document.getElementById("mreader");const st=o&&o.querySelector(".rd-stage");const cp=st&&st.querySelector(":scope>.rd-page");if(!cp||n<1||n>604)return null;
  let gh=st.querySelector(`.rd-ghost[data-p="${n}"]`);if(gh)return gh;gh=document.createElement("div");gh.className="rd-ghost";gh.dataset.p=n;gh.innerHTML=rPageBlock(n);
  const sr=st.getBoundingClientRect(),r=cp.getBoundingClientRect();Object.assign(gh.style,{position:"absolute",top:(r.top-sr.top)+"px",left:(r.left-sr.left)+"px",width:r.width+"px",height:r.height+"px",pointerEvents:"none",visibility:"hidden",transform:`translate3d(${n>RD.pg?-st.clientWidth:st.clientWidth}px,0,0)`});st.appendChild(gh);
  const m=gh.querySelector(".mushaf"),cm=cp.querySelector(".mushaf");try{if(m.dataset.kind==="mqcf")fitQcf(m);else if(m.dataset.kind==="m15")fitMushaf(m)}catch(e){}if(cm&&m&&cm.dataset.kind===m.dataset.kind&&!m.classList.contains("q-open")&&!cm.classList.contains("q-open")){m.style.fontSize=cm.style.fontSize;m.style.setProperty("height",cm.style.height,"important")}
  const H=rHL();gh.querySelectorAll("[data-rk]").forEach(w=>{const g=+w.dataset.rk.split(":")[0];if(H[g])w.style.background=`color-mix(in srgb,${H[g]} 38%,transparent)`});return gh}
/* تجهيز الصفحتين المجاورتين مسبقاً وقت الفراغ حتى يبدأ السحب بلا تأخير */
function rPreGhost(){clearTimeout(RD._pgT);RD._pgT=setTimeout(()=>{if(!RD.on||RD._drag||RD.sheet||rSpread())return;const go=()=>{try{[RD.pg+1,RD.pg-1].forEach(n=>{if(n>=1&&n<=604&&(QCF_OFF||(QCFP[n]&&QCFP[n].lines)))rGhost(n)})}catch(e){}};(window.requestIdleCallback||setTimeout)(go,{timeout:600})},180)}
/* المصحف من اليمين لليسار: سحب الإصبع لليمين يُظهر الصفحة التالية (تدخل من اليسار)، والعكس للسابقة */
function rDragTarget(dx){if(rSpread()){const a0=RD.pg%2?RD.pg:RD.pg-1;const n=a0+(dx>0?2:-2);return n>=1&&n<=604?n:null}const n=RD.pg+(dx>0?1:-1);return n>=1&&n<=604?n:null}
function rDragTo(dx,anim){RD._lastDx=dx;if(!anim){RD._pendDx=dx;if(RD._raf)return;RD._raf=requestAnimationFrame(()=>{RD._raf=0;rDragApply(RD._pendDx,false)});return}cancelAnimationFrame(RD._raf);RD._raf=0;rDragApply(dx,true)}
function rDragApply(dx,anim){const o=document.getElementById("mreader");const st=o&&o.querySelector(".rd-stage");if(!st)return;const sp=rSpread();const cp=st.querySelector(sp?":scope>.rd-spread":":scope>.rd-page");if(!cp)return;const W=st.clientWidth;
  const n=rDragTarget(dx);const ok=n!=null;const d=ok?dx:dx*.25;const gh=ok&&!sp&&dx!==0?rGhost(n):null;st.querySelectorAll(".rd-ghost").forEach(g=>{if(g!==gh)g.style.visibility="hidden"});
  const _du=(RD._dur||220)/1000;const tr=anim?`transform ${_du}s cubic-bezier(.2,.75,.25,1),opacity ${_du}s`:"none";cp.style.transition=tr;cp.style.transform=`translate3d(${d}px,0,0)`;if(sp)cp.style.opacity=anim&&Math.abs(d)>=W?"0":"";
  if(gh){gh.style.visibility="visible";gh.style.transition=tr;gh.style.transform=`translate3d(${d+(dx<0?W:-W)}px,0,0)`}}
function rDragEnd(dx,v){const o=document.getElementById("mreader");const st=o&&o.querySelector(".rd-stage");if(!st)return;const W=st.clientWidth;const n=rDragTarget(dx);RD._dur=null;
  if(dx&&n!=null&&(Math.abs(dx)>=W*.5||(v>.3&&Math.abs(dx)>18))){const sp=rSpread();RD._dur=Math.round(Math.max(120,Math.min(260,v>.3?(W-Math.abs(dx))/(v*1.6):(1-Math.abs(dx)/W)*300)));rDragTo(dx<0?-W:W,true);clearTimeout(RD._slT);
    RD._slT=setTimeout(()=>{const prev=RD.pg;RD.g=null;if(Math.abs(n-prev)>2)RD.prev=prev;RD.pg=n;ui.mpage=n;zls.set("rlast",n);RD.sheet=null;
      const gh=!sp&&st.querySelector(`.rd-ghost[data-p="${n}"]`);const cp=st.querySelector(":scope>.rd-page");
      if(gh&&cp&&gh.firstElementChild){const np=gh.firstElementChild;cp.replaceWith(np);gh.remove();st.querySelectorAll(".rd-ghost").forEach(g=>g.remove());
        const th=o.querySelector(".rd-strip .rd-th.cur");if(th)th.classList.remove("cur");const nt=o.querySelector(`.rd-strip .rd-th[data-v="${n}"]`);if(nt){nt.classList.add("cur");const sl=o.querySelector(".rd-strip");if(sl){RD._stIgn=Date.now()+900;const sr=sl.getBoundingClientRect(),tr=nt.getBoundingClientRect();sl.style.scrollBehavior="smooth";sl.scrollLeft+=(tr.left+tr.width/2)-(sr.left+sr.width/2)}}
        clearTimeout(RD._rrT);RD._rrT=setTimeout(()=>{const f=()=>{if(RD._drag)return;RD._noFade=true;rRender(true)};if(window.requestIdleCallback)requestIdleCallback(f,{timeout:700});else f()},320)}
      else{RD._noFade=true;rRender()}},(RD._dur||240)+15)}
  else{rDragTo(0,true);setTimeout(()=>{st.querySelectorAll(".rd-ghost").forEach(g=>{if(!RD._drag)g.style.visibility="hidden"});const cp=st.querySelector(":scope>.rd-spread");if(cp&&!RD._drag){cp.style.transform="";cp.style.opacity=""}},300)}}
function rSlide(d){const o=document.getElementById("mreader");const st=o&&o.querySelector(".rd-stage");const n=RD.pg+d;if(!st||rSpread()||n<1||n>604||!(QCF_OFF||(QCFP[n]&&QCFP[n].lines)))return false;rDragTo(d>0?1:-1);requestAnimationFrame(()=>requestAnimationFrame(()=>rDragEnd(d>0?st.clientWidth:-st.clientWidth,1)));return true}
function rNav(d){if(!rSpread()&&!RD.sheet&&rSlide(d)){RD.g=null;return}let n;if(rSpread()){const a0=RD.pg%2?RD.pg:RD.pg-1;n=a0+2*d}else n=RD.pg+d;n=Math.min(604,Math.max(1,n));if(n===RD.pg)return;RD.g=null;rGo(n)}
/* ===== بحث المصحف (آية / سورة / صفحة / جزء) ===== */
function mSearchRes(q0){if(!Q)return"";const q=rDig((q0||"").trim());if(!q)return "";
  const rn=x=>zNorm(x).replace(/[اءٔإأآ]/g,"");const R=[];const it=(p,g,t,sub)=>`<button class="ms-it" data-act="mGo" data-v="${p}" data-g="${g==null?"":g}"><span><b>${t}</b>${sub?`<small>${sub}</small>`:""}</span><em>ص ${AR_D(p)}</em></button>`;
  const sur=i=>it(pageOf(Q.ss[i]),Q.ss[i],`${AR_D(i+1)}. سورة ${esc(Q.s[i][0])}`,`${rMk(i)?"مكية":"مدنية"} · ${AR_D(Q.s[i][1])} آية`);
  if(/^[0-9]+$/.test(q)){const n=+q;if(n>=1&&n<=604)R.push(it(n,null,`الصفحة ${AR_D(n)}`,esc("سورة "+Q.s[sa(Q.p[n-1])[0]][0])));if(n>=1&&n<=114)R.push(sur(n-1));if(n>=1&&n<=30)R.push(it(pageOf(Q.j[n-1]),Q.j[n-1],`الجزء ${AR_D(n)}`,esc(JUZ_NAMES[n-1]||"")))}
  else{const mm=q.match(/^(.*?)[\s:،,]*([0-9]+)$/);if(mm&&mm[1]){const nm=rn(mm[1].replace(/^سورة\s*/,""));let si=Q.s.findIndex(x=>rn(x[0])===nm);if(si<0)si=Q.s.findIndex(x=>rn(x[0]).includes(nm));const a=+mm[2];if(si>=0&&a>=1&&a<=Q.s[si][1]){const g=Q.ss[si]+a-1;R.push(it(pageOf(g),g,`${esc(Q.s[si][0])}: ${AR_D(a)}`,`<span class="ms-q">${esc(Q.v[g])}</span>`))}}
    const nq=rn(q.replace(/^سورة\s*/,""));if(nq.length)Q.s.forEach((x,i)=>{if(rn(x[0]).includes(nq))R.push(sur(i))});
    if(q.length>1){const M=rFind(q);const N=M.length;
      if(N)R.push(`<div class="ms-cnt">${N===1?"آية واحدة":N===2?"آيتان":AR_D(N)+" "+(N<11?"آيات":"آية")}</div><div class="ms-card">${M.slice(0,100).map(([g,h])=>{const[si,a]=sa(g);const w=Q.v[g].split(" ");return `<button class="ms-sr" data-act="mGo" data-v="${pageOf(g)}" data-g="${g}"><span class="ms-srh"><b>${esc(Q.s[si][0])}: ${AR_D(a)}</b><em>${AR_D(pageOf(g))}</em></span><p class="ms-sq">${w.map((x,i)=>i>=h[0]&&i<=h[1]?`<mark>${esc(x)}</mark>`:esc(x)).join(" ")}</p></button>`}).join("")}</div>`)}}
  return R.length?R.join(""):`<p class="ms-none">لا نتائج — جرّب كلمة أخرى أو رقماً</p>`}
setTimeout(()=>{try{Object.assign(A,{
  mSearch:()=>{ui.msOpen=!ui.msOpen;render();if(ui.msOpen)setTimeout(()=>{const i=document.getElementById("m-q");if(i){i.focus();const n=i.value.length;try{i.setSelectionRange(n,n)}catch(e){}}},40)},
  mGo:el=>{ui.mpage=+el.dataset.v;ui.msOpen=false;ui.mflash=el.dataset.g!==""?+el.dataset.g:null;render();setTimeout(()=>{const w=document.querySelector(".mushaf-wrap");if(w)w.scrollIntoView({behavior:"smooth",block:"start"})},60)}})}catch(e){}},0);
document.addEventListener("input",e=>{if(e.target.id!=="m-q")return;ui.mq=e.target.value;clearTimeout(window.__mq);window.__mq=setTimeout(()=>{const r=document.getElementById("m-res");if(r)r.innerHTML=mSearchRes(ui.mq)},250)});
document.addEventListener("keydown",e=>{if(e.target.id==="m-q"&&e.key==="Enter"){const f=document.querySelector("#m-res .ms-it");if(f){e.preventDefault();f.click()}}if(e.target.id==="m-q"&&e.key==="Escape"){ui.msOpen=false;render()}});
/* ملاءمة بطاقة المواقيت لحجم صندوقها: تكبير المحتوى ليملأ المساحة بدل الفراغ */
function zmFit(){document.querySelectorAll(".zmw").forEach(w=>{const z=w.querySelector(".zad-mini");if(!z)return;z.style.zoom="";z.style.height="";const H=w.clientHeight,W=w.clientWidth;if(!H||!W)return;
  z.style.height="auto";const nh=z.offsetHeight;z.style.height="";if(!nh)return;let f=Math.min(W<600?1:1.5,Math.max(1,(H-2)/nh));
  if(f>1.02){z.style.zoom=f;z.style.height=(H/f)+"px";let k=0;while(k++<8&&f>1&&(z.scrollWidth>z.clientWidth+1||z.scrollHeight>z.clientHeight+1)){f=Math.max(1,f-.06);z.style.zoom=f;z.style.height=(H/f)+"px"}if(f<=1.02){z.style.zoom="";z.style.height=""}}})}
(function(){let t;const go=()=>{clearTimeout(t);t=setTimeout(zmFit,60)};try{new MutationObserver(m=>{if(m.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches&&(n.matches(".zmw,.zad-mini")||n.querySelector&&n.querySelector(".zmw"))))))go()}).observe(document.body,{childList:true,subtree:true})}catch(e){}addEventListener("resize",go);try{const ro=new ResizeObserver(go);setInterval(()=>{document.querySelectorAll(".zmw").forEach(w=>{if(!w.__ro){w.__ro=1;ro.observe(w)}})},1500)}catch(e){}})();
/* سحب صفحة المصحف (خارج وضع القراءة) لتقليبها مثل التطبيق، بدون القفز لأعلى */
(function(){let sx=0,sy=0,t0=0,on=false;document.addEventListener("touchstart",e=>{const w=e.target.closest&&e.target.closest(".mushaf-wrap");if(!w||ui.view!=="mushaf"||ui.tasmee){on=false;return}const t=e.touches[0];sx=t.clientX;sy=t.clientY;t0=Date.now();on=true},{passive:true});
  document.addEventListener("touchend",e=>{if(!on)return;on=false;const t=e.changedTouches[0];const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>60&&Math.abs(dy)<50&&Date.now()-t0<700){const y=scrollY;ui.mpage=Math.min(604,Math.max(1,(ui.mpage||1)+(dx>0?1:-1)));render();scrollTo(0,y)}},{passive:true})})();
function rStripScrub(st){const r=st.getBoundingClientRect();const cx=r.left+r.width/2;let best=null,bd=1e9;st.querySelectorAll(".rd-th").forEach(t=>{const b=t.getBoundingClientRect();const d=Math.abs(b.left+b.width/2-cx);if(d<bd){bd=d;best=t}});if(!best)return;const p=+best.dataset.v;
  st.querySelectorAll(".rd-th.hov").forEach(t=>t!==best&&t.classList.remove("hov"));best.classList.add("hov");const bub=document.querySelector("#mreader .rd-sbub");if(bub){const[si]=sa(Q.p[p-1]);bub.innerHTML=`<b>${AR_D(p)}</b><small>${esc(Q.s[si][0])} · الجزء ${AR_D(juzOf(Q.p[p-1]))}</small>`;bub.hidden=false}
  if(RD._stIgn&&Date.now()<RD._stIgn)return;clearTimeout(RD._stT);RD._stT=setTimeout(()=>{if(RD._stIgn&&Date.now()<RD._stIgn)return;if(RD._stDown){rStripScrub(st);return}if(bub)bub.hidden=true;if(p!==RD.pg){RD.g=null;rGo(p)}},320)}
function rBind(o){let sx=0,sy=0,moved=false,t0=0;
  o.addEventListener("pointerdown",e=>{if(!e.target.closest(".rd-stage"))return;sx=e.clientX;sy=e.clientY;moved=false;t0=Date.now();RD._lpDone=false;clearTimeout(RD._lpT);const w0=e.target.closest("[data-rk]");
    if(w0&&!RD.sheet){const gg=+w0.dataset.rk.split(":")[0];RD._lpT=setTimeout(()=>{if(moved)return;RD._lpDone=true;try{navigator.vibrate&&navigator.vibrate(15)}catch(_){}o.querySelectorAll(".rd-cur").forEach(x=>x.classList.remove("rd-cur"));o.querySelectorAll(`[data-rk^="${gg}:"]`).forEach(x=>x.classList.add("rd-cur"));try{rAyHL(o)}catch(_){}RD.g=gg;setTimeout(()=>{if(RD.g!==gg)return;RD.sheet="ayah";rRender()},220)},450)}});
  o.addEventListener("pointermove",e=>{if(sx&&(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10)){moved=true;clearTimeout(RD._lpT)}if(sx&&!RD.sheet&&!RD._lpDone){const dx=e.clientX-sx,dy=e.clientY-sy;if(RD._drag||(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2)){if(!RD._drag){RD._drag=true;RD._vh=[];if(e.pointerType==="mouse"){try{o.setPointerCapture(e.pointerId)}catch(_){}}}RD._vh.push([performance.now(),e.clientX]);if(RD._vh.length>8)RD._vh.shift();rDragTo(dx)}}});
  o.addEventListener("dragstart",e=>{if(e.target.closest(".rd-stage"))e.preventDefault()});
  {let tx=0,ty=0,hz=null;o.addEventListener("touchstart",e=>{const t=e.touches[0];tx=t.clientX;ty=t.clientY;hz=null},{passive:true});
   o.addEventListener("touchmove",e=>{if(!e.target.closest(".rd-stage")||RD.sheet)return;const t=e.touches[0];const dx=t.clientX-tx,dy=t.clientY-ty;if(hz===null&&(Math.abs(dx)>6||Math.abs(dy)>6))hz=Math.abs(dx)>Math.abs(dy);if((hz||RD._drag)&&e.cancelable)e.preventDefault()},{passive:false})}
  o.addEventListener("lostpointercapture",e=>{if(e.target!==o||e.pointerType!=="mouse")return;if(RD._drag){RD._drag=false;const dx=RD._lastDx||0;sx=0;rDragEnd(dx,0)}});
  o.addEventListener("contextmenu",e=>{if(e.target.closest(".rd-stage"))e.preventDefault()});
  o.addEventListener("pointercancel",()=>{if(RD._drag){RD._drag=false;rDragEnd(RD._lastDx||0,0)}sx=0});
  o.addEventListener("pointerup",e=>{clearTimeout(RD._lpT);if(RD._lpDone){RD._lpDone=false;sx=0;return}if(!sx)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=0;if(RD._drag){RD._drag=false;let v=0;{const H=(RD._vh||[]).concat([[performance.now(),e.clientX]]);const tN=H[H.length-1][0];const S=H.filter(h=>tN-h[0]<=110);if(S.length>1){const dt=S[S.length-1][0]-S[0][0],dxv=S[S.length-1][1]-S[0][1];if(dt>8){const sv=dxv/dt;if(Math.sign(sv)===Math.sign(dx))v=Math.abs(sv)}}}RD._vh=[];rDragEnd(dx,v);return}if(!e.target.closest(".rd-stage")||e.target.closest(".rd-nav"))return;
    if(Math.abs(dx)>50&&Math.abs(dy)<80){rNav(dx>0?1:-1);return}
    if(moved||Date.now()-t0>600)return;
    if(!RD.sheet&&RD.mem){const w=e.target.closest("[data-mk]");if(w){rMemTap(w);return}}if(!RD.sheet&&rTasmee()){const w=e.target.closest("[data-rk]");if(w){const k=w.dataset.rk;const x=ui.marks[k];if(!x){ui.marks[k]={t:"t",c:null,h:null};ui.mpick=k}else if(MT(x.t)==="t"){x.t="l";ui.mpick=k}else{delete ui.marks[k];if(ui.mpick===k)ui.mpick=null}ui.mlast=ui.marks[k]?k:null;rRender(true);rTmSync();return}}
    
    if(RD.sheet){RD.sheet=null;RD.g=null;rRender();return}RD.chrome=!RD.chrome;o.classList.toggle("rd-hide",!RD.chrome)});
  o.addEventListener("scroll",e=>{const st=e.target;if(!st.classList||!st.classList.contains("rd-strip")||RD._stProg)return;rStripScrub(st)},true);
  o.addEventListener("pointerdown",e=>{const st=e.target.closest(".rd-strip");if(!st)return;RD._stDown=true;RD._stMv=false;if(e.pointerType!=="mouse")return;const x0=e.clientX,sl=st.scrollLeft;st.style.scrollSnapType="none";st.style.scrollBehavior="auto";
    const mv=ev=>{const dx=ev.clientX-x0;if(Math.abs(dx)>4)RD._stMv=true;st.scrollLeft=sl-dx};const up=()=>{RD._stDown=false;st.style.scrollSnapType="";st.style.scrollBehavior="";removeEventListener("pointermove",mv);removeEventListener("pointerup",up);rStripScrub(st)};addEventListener("pointermove",mv);addEventListener("pointerup",up)});
  ["pointerup","pointercancel","touchend"].forEach(ev=>o.addEventListener(ev,()=>{if(RD._stDown){RD._stDown=false}},true));
  o.addEventListener("touchstart",e=>{if(e.target.closest(".rd-strip"))RD._stDown=true},{passive:true,capture:true});
  o.addEventListener("wheel",e=>{const st=e.target.closest(".rd-strip");if(!st)return;e.preventDefault();st.scrollLeft+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:-e.deltaY)},{passive:false});
  o.addEventListener("click",e=>{if(RD._stMv&&e.target.closest(".rd-strip")){RD._stMv=false;e.preventDefault();e.stopPropagation();return}if(e.target.closest(".rd-th")){clearTimeout(RD._stT);RD._stIgn=Date.now()+900;RD._stDown=false;const bub=o.querySelector(".rd-sbub");if(bub)bub.hidden=true}const b=e.target.closest("[data-ract]");if(!b||!o.contains(b))return;e.preventDefault();e.stopPropagation();const v=b.dataset.v;const f=RACT[b.dataset.ract];if(f)f(v,b)},true);
  o.addEventListener("keydown",e=>{if(e.target.id==="rd-q"&&e.key==="Enter"){clearTimeout(window.__rdq);RD.q=e.target.value;rRender(true);const f=o.querySelector(".rd-sh-srch .rd-list .rd-li");if(f){e.preventDefault();f.click()}}});
  o.addEventListener("input",e=>{if(e.target.id!=="rd-q")return;RD.q=e.target.value;clearTimeout(window.__rdq);window.__rdq=setTimeout(()=>{rRender(true);const i=document.getElementById("rd-q");if(i){i.focus();const n=i.value.length;try{i.setSelectionRange(n,n)}catch(_){}}},350)});
  o.addEventListener("change",e=>{const el=e.target.closest("[data-rchange]");if(!el)return;const k=el.dataset.rchange;if(k==="slide")rGo(+el.value);else if(k==="rc"){try{localStorage.setItem("halaqa-rc",el.value)}catch(e){}toast("تم اختيار القارئ")}else if(k==="q"){}else if(/^r[FT][SA]$/.test(k)){const w=k[1],cur=w==="F"?RD.rF:RD.rT;const[si,a]=sa(cur);let ns=si,na=a;if(k[2]==="S"){ns=+el.value;na=1}else na=+el.value;const g=Q.ss[ns]+Math.min(na,Q.s[ns][1])-1;if(w==="F"){RD.rF=g;if(RD.rT<g)RD.rT=Math.min(Q.ss[ns]+Q.s[ns][1]-1,g+4)}else RD.rT=Math.max(g,RD.rF);rRender(true)}else if(k==="tfSrc"){RD.tfSrc=el.value;zls.set("rtaf",el.value);rRender(true)}});}
const RACT={offDl:()=>rOffDl(),close:()=>rClose(),full:()=>rFull(true),nav:v=>rNav(+v),go:v=>{RD.g=null;rGo(+v)},goG:v=>{const g=+v;RD.sheet=null;rGo(pageOf(g),g);RD.sheet=null;rRender()},noop:()=>{},
  sheet:v=>{RD.sheet=RD.sheet===v&&v!=="rep"?null:v;rRender()},closeSheet:()=>{RD.sheet=null;RD.g=null;rRender()},idxTab:v=>{RD.idx=v;rRender();const sb=document.querySelector("#mreader .rd-sb");if(sb&&v!=="s"){const h=document.querySelector("#mreader .rd-jh.cur");if(h)sb.scrollTop=h.offsetTop-70}},
  menu:()=>{RD.sheet=RD.lastTab||"idx";rRender();rIdxScroll()},tab:v=>{RD.sheet=v;rRender();rIdxScroll()},hlBy:v=>{RD.hlBy=v;rRender(true)},
  lib:v=>{RD.g=+v;RD.sheet="lib";rRender()},libNav:v=>{const g=Math.min(Q.v.length-1,Math.max(0,RD.g+ +v));RD.g=g;rRender();const sb=document.querySelector("#mreader .rd-sb");if(sb)sb.scrollTop=0},
  jumpJ:v=>{const sb=document.querySelector("#mreader .rd-sb");const h=document.getElementById("rd-j"+v);if(sb&&h){sb.scrollTop=h.offsetTop-70}else{RD.sheet=null;rGo(pageOf(Q.j[+v-1]))}},
  ayah:v=>{RD.g=+v;RD.sheet="ayah";rRender()},
  ayEd:()=>{RD.ayEd=!RD.ayEd;rRender(true)},ayMv:v=>{const[k,d]=v.split(":");let o=zls.get("rayord",null);const K0=["bm","tl","tf","sh","hl"];if(!Array.isArray(o)||o.length!==5)o=K0.slice();const i=o.indexOf(k),j=i+(+d);if(i<0||j<0||j>4)return;[o[i],o[j]]=[o[j],o[i]];zls.set("rayord",o);rRender(true)},
  clrQ:()=>{RD.q="";RD.srN=0;rRender(true);setTimeout(()=>{const i=document.getElementById("rd-q");if(i)i.focus()},30)},srMore:()=>{RD.srN=(RD.srN||120)+120;rRender(true)},
  saveImg:v=>rAyImg(+v),
  bmSet:v=>{zls.set("rbmLast:"+rU(),v);const B=rBM();B[v]={g:RD.g,at:new Date().toISOString()};zls.set("rbm:"+rU(),B);toast("وُضع الفاصل "+(RBM.find(x=>x[0]===v)||[,""])[1]);rRender(true)},
  bmDel:v=>{const B=rBM();delete B[v];zls.set("rbm:"+rU(),B);rRender(true)},bmEdit:()=>{RD.bmEdit=!RD.bmEdit;rRender(true)},
  hlSet:v=>{const H=rHL();if(v)H[RD.g]=v;else delete H[RD.g];zls.set("rhl:"+rU(),H);rRender(true)},hlDel:v=>{const H=rHL();delete H[v];zls.set("rhl:"+rU(),H);rRender(true)},
  playG:v=>{const[si,a]=sa(+v);PL._lp=1;plPlay([[si+1,a]],"تلاوة آية")},stop:()=>{plStop();rRender(true)},
  repStart:()=>{const f=RD.rF,e=Math.max(RD.rF,RD.rT);if(f==null)return;if(e-f>700){toast("المقطع طويل جداً، اختر نطاقاً أقصر","err");return}const L=[];for(let x=f;x<=e;x++){const[si,a]=sa(x);L.push([si+1,a])}PL.rep=RD.r1||1;PL._lp=RD.r2||1;plPlay(L,`من ${rSA(f)} إلى ${rSA(e)}`);RD.sheet=null;rRender()},
  repFrom:()=>{RD.rF=null;RD.rOpen=null;RD.sheet="rep";rRender()},
  rrOpen:v=>{RD.rOpen=RD.rOpen===v?null:v;rRender(true)},rrTg:v=>{const k="r"+v;RD[k]=(RD[k]||1)>1?1:3;if(PL.on){if(v==="1")PL.rep=RD.r1;else PL._lp=RD.r2}rRender(true)},rrN:v=>{const[k,n]=v.split(":");RD["r"+k]=+n;if(PL.on){if(k==="1")PL.rep=+n;else PL._lp=+n}rRender(true)},
  copyAy:v=>{const g=+v;copy(`﴿${Q.v[g]}﴾ [${rSA(g)}]`)},shareAy:v=>{const g=+v;const t=`﴿${Q.v[g]}﴾ [${rSA(g)}]`;try{if(navigator.share){navigator.share({text:t}).catch(()=>{});return}}catch(e){}copy(t)},
  playPage:()=>{const pg=RD.pg;const f=Q.p[pg-1],t=(pg<604?Q.p[pg]:Q.v.length)-1;const L=[];for(let g=f;g<=t;g++){const[si,a]=sa(g);L.push([si+1,a])}PL._lp=1;plPlay(L,`الصفحة ${pg}`);RD.sheet=null;rRender()},
  theme:v=>{setThemeMode(v);rRender(true)},fs:()=>{try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>toast("ملء الشاشة غير مدعوم في هذا المتصفح"))}catch(e){}setTimeout(()=>rRender(true),300)},
  goPg:()=>{const v=+(document.getElementById("rd-pg")||{}).value;if(v>=1&&v<=604){RD.sheet=null;rGo(v)}},
  heatTg:()=>{zls.set("rheat",zls.get("rheat",true)===false);rRender(true)},
  pStart:()=>{const g=RD.g!=null?RD.g:Q.p[RD.pg-1];const L=[];for(let x=g;x<Q.v.length&&L.length<800;x++){const[si,a]=sa(x);L.push([si+1,a])}PL._lp=1;plPlay(L,"تلاوة");rPlayerUpdate()},
  pStop:()=>{plStop();rPlayerUpdate()},
  pToggle:()=>{const a=document.getElementById("qplayer");if(!a)return;if(a.paused)a.play().catch(()=>{});else a.pause();setTimeout(rPlayerUpdate,50)},
  pPrev:()=>{if(PL.i>0){PL.i--;PL.r=0;plLoad()}},pNext:()=>{if(PL.i<PL.q.length-1){PL.i++;PL.r=0;plLoad()}},
  pRep:()=>{RD.rF=null;RD.rOpen=null;RD.sheet="rep";rRender()},
  pRate:()=>{const S=[1,1.25,1.5,0.75];const i=S.indexOf(PL.rate||1);PL.rate=S[(i+1)%S.length];const a=document.getElementById("qplayer");if(a)a.playbackRate=PL.rate;rPlayerUpdate()},
  rcPick:v=>{try{localStorage.setItem("halaqa-rc",v)}catch(e){}RD.sheet=null;if(PL.on){const a=document.getElementById("qplayer");plLoad()}rRender()},
  search:()=>{RD.sheet="srch";rRender();setTimeout(()=>{const q=document.getElementById("rd-q");if(q)q.focus()},60)},
  back:()=>{const p=RD.prev||RD.openPg;if(p&&p!==RD.pg){RD.prev=RD.pg;RD.pg=p;RD.g=null;rRender()}},
  khd:v=>{RD.khd=v==="c"?"c":+v;rRender(true)},khStart:()=>{const kc=document.querySelector("#mreader .khc");const K=RD.khd==="c"&&kc?khRead(kc):{start:today(),days:RD.khd||30};zls.set("rk:"+rU(),{...K,done:{}});toast("بدأت ختمتك، وفقك الله");rRender()},
  khDone:v=>{const K=zls.get("rk:"+rU(),null);if(!K)return;if(K.done[v])delete K.done[v];else K.done[v]=1;zls.set("rk:"+rU(),K);rRender(true)},
  khDel:()=>{if(!confirm("حذف الختمة الحالية؟"))return;zls.set("rk:"+rU(),null);rRender()}};
(function(){const _pl=plLoad;plLoad=function(){_pl();try{if(!RD.on)return;const it=PL.q[PL.i];if(!it)return;const g=Q.ss[it[0]-1]+it[1]-1;RD.playG=g;const p=pageOf(g);rPlayerUpdate();if(p!==RD.pg){RD.pg=p;rRender(true)}else{const o=document.getElementById("mreader");if(o)o.querySelectorAll("[data-rk]").forEach(w=>w.classList.toggle("rd-play",+w.dataset.rk.split(":")[0]===g))}}catch(e){}};
  const _pp=plPlay;plPlay=function(list,label){PL.li=0;PL.lp=PL._lp||1;PL._lp=0;return _pp(list,label)};
  const _st=plStop;plStop=function(){_st();RD.playG=null;try{if(RD.on){rPlayerUpdate();const o=document.getElementById("mreader");if(o)o.querySelectorAll(".rd-play").forEach(w=>w.classList.remove("rd-play"))}}catch(e){}}})();
document.addEventListener("keydown",e=>{if(!RD.on)return;if(e.target&&/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName))return;if(e.key==="ArrowLeft"){e.preventDefault();rNav(1)}else if(e.key==="ArrowRight"){e.preventDefault();rNav(-1)}else if(e.key==="Escape"){e.preventDefault();if(RD.sheet){RD.sheet=null;RD.g=null;rRender()}else if(!(RD.embedOn&&!RD.full))rClose()}},true);
addEventListener("resize",()=>{if(RD.on){clearTimeout(window.__rdr);window.__rdr=setTimeout(()=>rRender(true),150)}});
function fePanel(el){let p=document.getElementById("fe-panel");if(!el){if(p)p.remove();return}const v=feVal();const sc=feScope();
  if(!p){p=document.createElement("div");p.id="fe-panel";document.body.appendChild(p)}
  const cs=getComputedStyle(el);const fs=Math.round(parseFloat(cs.fontSize)||16);const txtEl=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||!el.children.length;
  p.innerHTML=`<div class="fe-h" title="اسحب من هنا لتحريك اللوحة"><span class="fe-grip">⠿</span><b>${feSet().length>1?`تحريك ${feSet().length} عناصر`:"تحريك العنصر"}</b><span class="fe-hb"><button type="button" data-act="fePos" data-v="r" title="ثبّتها يمين الشاشة">⇥</button><button type="button" data-act="fePos" data-v="l" title="ثبّتها يسار الشاشة">⇤</button><button type="button" data-act="fePos" data-v="auto" title="تتبع العنصر تلقائياً">⌖</button><button type="button" data-act="feMin" title="${ui.feMin?"توسيع":"تصغير"}">${ui.feMin?"▢":"–"}</button><button type="button" data-act="feClose" title="إغلاق">✕</button></span></div><div class="fe-body" ${ui.feMin?"hidden":""}>
  <div class="fe-g"><span>يطبّق على</span>${devBtns()}</div>
  <div class="fe-g"><span>المكان</span><div class="fe-pad"><button data-act="feNudge" data-dx="0" data-dy="-5">↑</button><button data-act="feNudge" data-dx="5" data-dy="0">→</button><button data-act="feNudge" data-dx="-5" data-dy="0">←</button><button data-act="feNudge" data-dx="0" data-dy="5">↓</button></div><small class="muted">اسحب العنصر نفسه · Shift: خط مستقيم · Shift+نقر: تحديد إضافي · اسحب بالزر الأيسر في أي مكان لتحديد عدة عناصر بالمستطيل</small></div>
  <div class="fe-g"><span>حجم الخط</span><div class="row"><button data-act="feFs" data-n="-1">−</button><b class="num">${v.fs||fs}px</b><button data-act="feFs" data-n="1">+</button></div></div>
  <div class="fe-g"><span>السماكة</span><div class="row"><button data-act="feFw" data-v="400" class="${v.fw==400?"on":""}">عادي</button><button data-act="feFw" data-v="700" class="${v.fw==700?"on":""}">عريض</button><button data-act="feFw" data-v="" class="${!v.fw?"on":""}">تلقائي</button></div></div>
  <div class="fe-g"><span>اللون</span><div class="row"><input type="color" value="${okCol(v.c)||"#24406f"}" data-change="feCol" data-p="c"><button data-act="feClr" data-p="c">تلقائي</button></div></div>
  <div class="fe-g"><span>الخلفية</span><div class="row"><input type="color" value="${okCol(v.bg)||"#ffffff"}" data-change="feCol" data-p="bg"><button data-act="feClr" data-p="bg">تلقائي</button></div></div>
  <details class="fe-g fe-icd" ${ui.feIcOpen?"open":""} ontoggle="ui.feIcOpen=this.open"><summary>الأيقونة <small class="muted">(اضغط لاختيار أيقونة)</small></summary><div class="fe-icg">${["auto","none",...Object.keys(DIC),...Object.keys(design().icImgs||{}).map(x=>"img:"+x)].map(k=>`<button type="button" class="${(v.ic||"auto")===k?"on":""}" data-act="feIc" data-v="${k}" title="${k==="auto"?"تلقائي":k==="none"?"بدون":k}">${k==="auto"?"<small>تلقائي</small>":k==="none"?"<small>بدون</small>":k.startsWith("img:")?`<img src="${esc((design().icImgs||{})[k.slice(4)]||"")}" style="width:100%;height:100%;object-fit:contain">`:`<i style='--m:${dicURL(k,"#000")}'></i>`}</button>`).join("")}</div><label class="btn sm" style="margin-top:6px;cursor:pointer">⬆ رفع أيقونة خاصة (SVG/PNG)<input type="file" accept="image/svg+xml,image/png,image/webp" hidden data-change="feIcUp"></label></details>
  <div class="fe-g"><span>يطبق على الأدوار</span><div class="seg modeseg fe-rs"><button data-act="feRoleSet" data-v="one" class="${!ui.feRoles?"on":""}">هذا الدور</button><button data-act="feRoleSet" data-v="pick" class="${Array.isArray(ui.feRoles)?"on":""}">أدوار مختارة</button><button data-act="feRoleSet" data-v="all" class="${ui.feRoles==="all"?"on":""}">كل الأدوار</button></div>${Array.isArray(ui.feRoles)?`<div class="fe-rchips">${Object.keys(ROLE).filter(r=>r!==(feSet()[0]||"").split(":")[0]).map(r=>`<button class="${ui.feRoles.includes(r)?"on":""}" data-act="feRoleSet" data-v="${r}">${esc(ROLE[r])}</button>`).join("")}</div>`:""}<small class="muted">${ui.feRoles==="all"?"أي تعديل الآن ينسخ لنفس العنصر في واجهات كل الأدوار":Array.isArray(ui.feRoles)?"التعديل يطبق على هذا الدور + المحدد":"التعديل خاص بالدور الحالي"}</small></div>
  <div class="fe-g"><span>الشكل</span>
   <label class="fe-rg">الاستدارة <input type="range" min="0" max="60" value="${+v.br||0}" data-change="feProp" data-p="br"><b>${v.br!=null&&v.br!==""?v.br+"px":"تلقائي"}</b></label>
   <label class="fe-rg">سماكة الحد <input type="range" min="0" max="8" value="${+v.bw||0}" data-change="feProp" data-p="bw"><input type="color" value="${okCol(v.bc)||"#f5c547"}" data-change="feProp" data-p="bc"></label>
   <label class="fe-rg">الشفافية <input type="range" min="10" max="100" value="${v.op!=null&&v.op!==""?v.op:100}" data-change="feProp" data-p="op"><b>${v.op!=null&&v.op!==""?v.op+"%":"100%"}</b></label>
   <div class="row"><span class="small">الظل:</span>${[["","تلقائي"],["0","بدون"],["1","خفيف"],["2","قوي"]].map(([k,l])=>`<button data-act="feShadow" data-v="${k}" class="${String(v.sh??"")===k?"on":""}">${l}</button>`).join("")}<button data-act="feShapeReset" class="ghost">إرجاع الشكل</button></div></div>
  ${el.dataset.ic?`<div class="fe-g"><span>تنسيق الأيقونة</span>
   <label class="fe-rg">الحجم <input type="range" min="16" max="90" value="${+v.ics||parseInt(getComputedStyle(document.documentElement).getPropertyValue("--ics"))||42}" data-change="feProp" data-p="ics"><b>${v.ics?v.ics+"px":"تلقائي"}</b></label>
   <label class="fe-rg">الاستدارة <input type="range" min="0" max="50" value="${v.icr!=null&&v.icr!==""?v.icr:30}" data-change="feProp" data-p="icr"><b>${v.icr!=null&&v.icr!==""?v.icr+"%":"تلقائي"}</b></label>
   <div class="row"><label class="row small">لون الرمز <input type="color" value="${okCol(v.icc)||"#1fa6c6"}" data-change="feProp" data-p="icc"></label><label class="row small">الخلفية <input type="color" value="${okCol(v.icbg)||"#e2eaf5"}" data-change="feProp" data-p="icbg"></label><button data-act="feIcBgNone" class="ghost">بلا خلفية</button></div>
   <div class="row"><span class="small">تحريك:</span><button data-act="feIcNudge" data-dx="0" data-dy="-4">↑</button><button data-act="feIcNudge" data-dx="0" data-dy="4">↓</button><button data-act="feIcNudge" data-dx="4" data-dy="0">→</button><button data-act="feIcNudge" data-dx="-4" data-dy="0">←</button><button data-act="feIcReset" class="ghost">إرجاع الأيقونة</button></div></div>`:""}
  <div class="fe-g"><span>التنسيق</span><div class="row"><button data-act="feFmtCopy">نسخ التنسيق</button><button data-act="feFmtPaste" ${window.__feFmt?"":"disabled"}>لصق التنسيق</button></div></div>
  <div class="fe-g"><span>الحجم</span><div class="row"><small class="muted">${v.w?v.w+"px":"تلقائي"} × ${v.h?v.h+"px":"تلقائي"}</small><button data-act="feSizeClr">حجم تلقائي</button>${v.zm?`<small class="muted">تكبير ${Math.round(v.zm*100)}%</small>`:""}</div><small class="muted">اسحب الدوائر حول العنصر · الزوايا تكبّر المحتوى معه · الأطراف تغيّر الصندوق فقط · Shift: نفس النسبة · Alt مع الزاوية: الصندوق فقط</small></div>
  ${txtEl?`<div class="fe-g"><span>النص</span><input class="fe-txt" value="${esc(v.txt||"")}" placeholder="اكتب نصاً جديداً أو اتركه" data-change="feTxt"></div>
  <div class="fe-g"><span>تلوين جزء من النص</span><input class="fe-src" readonly value="${esc((el.textContent||"").trim().slice(0,200))}" title="حدّد بالماوس الجزء اللي تبي تلوّنه"><div class="row" style="flex-wrap:wrap"><input type="color" class="fe-pc" value="#f5c547"><button data-act="fePart" data-k="c">لوّن المحدد</button><button data-act="fePart" data-k="b">عريض</button><button data-act="fePart" data-k="digits">لوّن الأرقام</button></div>${(v.parts||[]).length?`<div class="fe-parts">${v.parts.map((pt,i)=>`<span class="pill" style="${okCol(pt.c)?`color:${pt.c};`:""}${pt.fw?"font-weight:800;":""}">${pt.re==="digits"?"الأرقام":esc(pt.s)} <button data-act="fePartDel" data-i="${i}" title="حذف">✕</button></span>`).join("")}</div>`:""}<small class="muted">حدّد الكلمة داخل المربع ثم اختر اللون واضغط «لوّن المحدد»</small></div>`:""}
  <div class="fe-f"><button data-act="feHide">${v.hide?"إظهار":"إخفاء"}</button><button data-act="feReset">إرجاع للأصل</button></div><p class="fe-n">احفظ من «حفظ التعديلات» أسفل الشاشة.</p></div>`;
  feSetPos(p,el)}
function feGetPos(){if(ui.fePos)return ui.fePos;try{const x=JSON.parse(localStorage.getItem("fePos")||"null");if(x)ui.fePos=x}catch(e){}return ui.fePos||{mode:"auto"}}
function feSavePos(o){ui.fePos=o;try{localStorage.setItem("fePos",JSON.stringify(o))}catch(e){}}
function feSetPos(p,el){const pw=p.offsetWidth||260,ph=p.offsetHeight||300,P=feGetPos(),M=12;let left,top;
  if(P.mode==="free"){left=P.left;top=P.top}
  else if(P.mode==="r"){left=innerWidth-pw-M;top=90}
  else if(P.mode==="l"){left=M;top=90}
  else{const r=el?el.getBoundingClientRect():{left:innerWidth/2,right:innerWidth/2,top:120,bottom:120};const spaceL=r.left,spaceR=innerWidth-r.right;
    if(spaceL>=pw+2*M||spaceR>=pw+2*M){left=spaceL>spaceR?r.left-pw-M:r.right+M;top=r.top}
    else{left=(r.left+r.right)/2>innerWidth/2?M:innerWidth-pw-M;top=r.bottom+M+ph>innerHeight?Math.max(M,r.top-ph-M):r.bottom+M}}
  left=Math.max(M,Math.min(innerWidth-pw-M,left));top=P.mode==="free"?Math.max(M,Math.min(innerHeight-120,top)):Math.max(M,Math.min(innerHeight-Math.min(ph,innerHeight-2*M)-M,top));p.style.left=left+"px";p.style.top=top+"px";p.style.maxHeight=Math.max(120,innerHeight-top-M)+"px"}
(function(){let pd=null;
document.addEventListener("pointerdown",e=>{const h=e.target.closest&&e.target.closest("#fe-panel .fe-h");if(!h||e.target.closest("button"))return;const p=document.getElementById("fe-panel");const r=p.getBoundingClientRect();pd={p,dx:e.clientX-r.left,dy:e.clientY-r.top};e.preventDefault()});
document.addEventListener("pointermove",e=>{if(!pd)return;const t=Math.max(0,Math.min(innerHeight-60,e.clientY-pd.dy));pd.p.style.left=Math.max(0,Math.min(innerWidth-pd.p.offsetWidth,e.clientX-pd.dx))+"px";pd.p.style.top=t+"px";pd.p.style.maxHeight=Math.max(120,innerHeight-t-12)+"px"});
document.addEventListener("pointerup",()=>{if(!pd)return;const r=pd.p.getBoundingClientRect();feSavePos({mode:"free",left:Math.round(r.left),top:Math.round(r.top)});pd=null});
})();
(function(){let hov=null,drag=null;
const navLike=t=>t.closest&&t.closest('[data-act="go"],.kidtabs button,.subtabs button,[data-act="kid"],[data-act="ctab"]');
const cand=t=>{if(!ui.freeEdit||!t||!t.closest)return null;if(t.closest("#fe-panel,.pv-bar,.hb-bar,.hb-tools,.draftbar,#modal,.demo-bar,.hb-entry"))return null;if(!t.closest("main,header.top,.tabbar"))return null;return t.closest(FE_SEL)};
document.addEventListener("mouseover",e=>{const c=cand(e.target);if(hov&&hov!==c)hov.classList.remove("fe-hov");hov=c;if(c)c.classList.add("fe-hov")});
document.addEventListener("click",e=>{if(!ui.freeEdit)return;const t=e.target;if(Date.now()-(window.__feMqAt||0)<300&&t.closest&&!t.closest("#fe-panel,.pv-bar,.draftbar,#modal")){e.preventDefault();e.stopPropagation();return}const inZone=t.closest&&t.closest("main,header.top,.tabbar")&&!t.closest("#fe-panel,.pv-bar,.hb-bar,.hb-tools,.draftbar,#modal,.demo-bar,.hb-entry");const c=cand(t);if(!c){if(inZone){e.preventDefault();e.stopPropagation()}return}e.preventDefault();e.stopPropagation();const path=fePath(c);if(!path)return;const nk=pvKey()+"|"+path;if(e.shiftKey&&ui.feSel){if(Date.now()-(window.__feDragAt||0)<300)return;const S=feSet().slice();const i=S.indexOf(nk);if(i>=0)S.splice(i,1);else S.push(nk);ui.feMulti=S;ui.feSel=S[S.length-1]||null}else{ui.feMulti=null;ui.feSel=nk;ui.feScope=null}feApplyText()},true);
document.addEventListener("pointerdown",e=>{if(!ui.freeEdit||e.button!==0)return;const c=e.target.closest&&e.target.closest(".fe-on");if(!c||!cand(e.target))return;e.preventDefault();drag={x:e.clientX,y:e.clientY,moved:false,coarse:e.pointerType!=="mouse",items:feSet().map(b=>{const v=feValOf(b);return {b,el:feElOf(b),x0:+v.x||0,y0:+v.y||0}}).filter(o=>o.el)};
  if(drag.items.length===1){const el=drag.items[0].el;const hb=el.classList.contains("hb")?el:(el.parentElement&&el.parentElement.classList.contains("hb")?el.parentElement:null);if(hb&&hb.parentElement){drag.hb=hb;drag.ol=hb.offsetLeft;drag.ot=hb.offsetTop;drag.order0=[...hb.parentElement.children].filter(x=>x.classList.contains("hb")).map(x=>x.dataset.hk)}}
  if(!drag.hb){const el=(drag.items[0]||{}).el;const pe=el&&el.parentElement;const box=pe&&(pe.closest(".zhh-tm,.zhh-list,.zhh-top,.zad-hero,.zad-mini,.greet,.card,.hb,.li,.row-card")||pe.closest("main"));const br=box?box.getBoundingClientRect():null;const er=el?el.getBoundingClientRect():null;if(br&&er){drag.lim={l:br.left-er.left,r:br.right-er.right,t:br.top-er.top,b:br.bottom-er.bottom}}}
  feSnapInit(drag)},true);
document.addEventListener("pointermove",e=>{if(!drag)return;if(window.__hbLift){drag=null;return}let dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(drag.hb){if(!drag.moved&&Math.abs(dx)+Math.abs(dy)<6)return;const hb=drag.hb;if(!drag.moved){drag.moved=true;hb.classList.add("hb-lift");document.body.classList.add("hb-reordering")}
    hb.style.pointerEvents="none";const under=document.elementFromPoint(e.clientX,e.clientY);hb.style.pointerEvents="";const tgt=under&&under.closest&&under.closest(".hb");
    if(tgt&&tgt!==hb&&tgt.parentElement===hb.parentElement){const sib=[...hb.parentElement.children].filter(x=>x.classList.contains("hb")&&x!==hb);const R=new Map(sib.map(x=>[x,x.getBoundingClientRect()]));const r=tgt.getBoundingClientRect();const before=(e.clientY<r.top+r.height/2);
      const ref=before?tgt:tgt.nextSibling;if(ref!==hb&&hb.nextSibling!==ref){hb.parentElement.insertBefore(hb,ref);sib.forEach(x=>{const a=R.get(x),b2=x.getBoundingClientRect();const ddx=a.left-b2.left,ddy=a.top-b2.top;if(ddx||ddy){x.style.transition="none";x.style.transform=`translate(${ddx}px,${ddy}px)`;requestAnimationFrame(()=>{x.style.transition="transform .22s cubic-bezier(.2,.8,.3,1)";x.style.transform=""})}});try{navigator.vibrate&&navigator.vibrate(8)}catch(_){}}}
    const ox=hb.offsetLeft-drag.ol,oy=hb.offsetTop-drag.ot;hb.style.transform=`translate(${(drag.coarse?0:dx)-ox}px,${dy-oy}px) scale(1.02)`;return}
  if(e.shiftKey){if(Math.abs(dx)>=Math.abs(dy))dy=0;else dx=0}
  if(drag.coarse){if(Math.abs(dx)>Math.abs(dy)*1.6)dy=0;else if(Math.abs(dy)>Math.abs(dx)*1.6)dx=0;dx=Math.round(dx/8)*8;dy=Math.round(dy/8)*8}
  if(drag.lim){dx=Math.max(drag.lim.l,Math.min(drag.lim.r,dx));dy=Math.max(drag.lim.t,Math.min(drag.lim.b,dy))}if(!e.altKey){const sn=feSnap(drag,dx,dy);dx=sn.dx;dy=sn.dy}else feGuidesOff();if(drag.lim){dx=Math.max(drag.lim.l,Math.min(drag.lim.r,dx));dy=Math.max(drag.lim.t,Math.min(drag.lim.b,dy))}drag.dx=dx;drag.dy=dy;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;drag.items.forEach(o=>o.el.style.setProperty("transform",`translate(${o.x0+dx}px,${o.y0+dy}px)`,"important"))});
document.addEventListener("pointerup",e=>{if(!drag)return;const d=drag;drag=null;
  if(d.hb){const hb=d.hb;document.body.classList.remove("hb-reordering");if(!d.moved)return;window.__feDragAt=Date.now();hb.style.transition="transform .2s ease";hb.style.transform="";setTimeout(()=>{hb.style.transition="";hb.classList.remove("hb-lift")},220);
    const now=[...hb.parentElement.children].filter(x=>x.classList.contains("hb")).map(x=>x.dataset.hk);if(now.join()===d.order0.join())return;const g=hb.dataset.g;try{const items=homeOrder(g);const vis=items.filter(it=>now.includes(it.k));const pos=items.map((it,i)=>now.includes(it.k)?i:-1).filter(i=>i>=0);const by=Object.fromEntries(items.map(it=>[it.k,it]));const out=items.slice();pos.forEach((p,j)=>{out[p]=by[now[j]]});hbSave(g,out)}catch(err){console.error(err)}return}
  if(!d.moved)return;feGuidesOff();let dx=d.dx||0,dy=d.dy||0;window.__feDragAt=Date.now();const M={};d.items.forEach(o=>M[o.b]=o);setFreeMany(b=>M[b]?{x:Math.round(M[b].x0+dx),y:Math.round(M[b].y0+dy)}:{})});
})();

/* ترتيب صناديق الرئيسية بأسلوب الآيفون: ضغطة مطوّلة على الصندوق ثم سحبه، والبقية تتزحزح لتفسح له */
(function(){let L=null,T=null,st=null;
const end=()=>{clearTimeout(T);T=null;st=null};
document.addEventListener("pointerdown",e=>{if(!(ui.freeEdit||document.querySelector(".hgrid.editing"))||e.button!==0)return;const hb=e.target.closest&&e.target.closest(".hgrid .hb");if(!hb||e.target.closest(".hb-tools,.hb-rs")||(!ui.freeEdit&&e.target.closest("select,input,textarea,button,a")))return;
  st={x:e.clientX,y:e.clientY,hb,id:e.pointerId};clearTimeout(T);T=setTimeout(()=>{if(!st)return;const p=hb.parentElement;L={hb,x:st.x,y:st.y,ol:hb.offsetLeft,ot:hb.offsetTop,order0:[...p.children].filter(x=>x.classList.contains("hb")).map(x=>x.dataset.hk)};window.__hbLift=true;hb.classList.add("hb-lift");document.body.classList.add("hb-reordering");try{navigator.vibrate&&navigator.vibrate(15)}catch(_){}},380)},true);
document.addEventListener("pointermove",e=>{if(st&&!L&&Math.abs(e.clientX-st.x)+Math.abs(e.clientY-st.y)>8){end();return}if(!L)return;e.preventDefault();e.stopPropagation();const hb=L.hb;const dx=e.clientX-L.x,dy=e.clientY-L.y;
  hb.style.pointerEvents="none";const under=document.elementFromPoint(e.clientX,e.clientY);hb.style.pointerEvents="";const tgt=under&&under.closest&&under.closest(".hb");
  if(tgt&&tgt!==hb&&tgt.parentElement===hb.parentElement){const sib=[...hb.parentElement.children].filter(x=>x.classList.contains("hb")&&x!==hb);const R=new Map(sib.map(x=>[x,x.getBoundingClientRect()]));const r=tgt.getBoundingClientRect();const before=e.clientY<r.top+r.height/2;const ref=before?tgt:tgt.nextSibling;
    if(ref!==hb&&hb.nextSibling!==ref){hb.parentElement.insertBefore(hb,ref);sib.forEach(x=>{const a=R.get(x),b2=x.getBoundingClientRect();const ddx=a.left-b2.left,ddy=a.top-b2.top;if(ddx||ddy){x.style.transition="none";x.style.transform=`translate(${ddx}px,${ddy}px)`;requestAnimationFrame(()=>requestAnimationFrame(()=>{x.style.transition="transform .24s cubic-bezier(.2,.8,.3,1)";x.style.transform=""}))}});try{navigator.vibrate&&navigator.vibrate(8)}catch(_){}}}
  const ox=hb.offsetLeft-L.ol,oy=hb.offsetTop-L.ot;const coarse=e.pointerType!=="mouse";hb.style.transform=`translate(${(coarse?0:dx)-ox}px,${dy-oy}px) scale(1.03)`;
  const ed=24;if(e.clientY<ed)scrollBy(0,-12);else if(e.clientY>innerHeight-ed-60)scrollBy(0,12)},{capture:true,passive:false});
const drop=e=>{end();if(!L)return;const d=L;L=null;window.__hbLift=false;window.__feDragAt=Date.now();const hb=d.hb;document.body.classList.remove("hb-reordering");hb.style.transition="transform .22s ease";hb.style.transform="";setTimeout(()=>{hb.style.transition="";hb.classList.remove("hb-lift")},230);
  const now=[...hb.parentElement.children].filter(x=>x.classList.contains("hb")).map(x=>x.dataset.hk);if(now.join()===d.order0.join())return;const g=hb.dataset.g;try{const items=homeOrder(g);const pos=items.map((it,i)=>now.includes(it.k)?i:-1).filter(i=>i>=0);const by=Object.fromEntries(items.map(it=>[it.k,it]));const out=items.slice();pos.forEach((p,j)=>{out[p]=by[now[j]]});setTimeout(()=>hbSave(g,out),240);toast("تم تغيير الترتيب")}catch(err){console.error(err)}};
document.addEventListener("pointerup",drop,true);document.addEventListener("pointercancel",drop,true);
document.addEventListener("click",e=>{if(Date.now()-(window.__feDragAt||0)<350&&e.target.closest&&e.target.closest(".hgrid")){e.preventDefault();e.stopPropagation()}},true);
document.addEventListener("contextmenu",e=>{if((ui.freeEdit||document.querySelector(".hgrid.editing"))&&e.target.closest&&e.target.closest(".hgrid .hb"))e.preventDefault()},true);
})();
/* تحديد العناصر بالسحب (مستطيل تحديد) */
(function(){let mq=null;const ZX="#fe-panel,.pv-bar,.hb-bar,.hb-tools,.draftbar,#modal,.demo-bar,.hb-entry,#fe-box";
document.addEventListener("pointerdown",e=>{if(!ui.freeEdit||e.button!==0||e.pointerType==="touch")return;const t=e.target;if(!t.closest||t.closest(ZX))return;if(!t.closest("main,header.top,.tabbar"))return;if(t.closest(".fe-on"))return;mq={x:e.clientX,y:e.clientY,add:e.shiftKey,on:false};e.preventDefault()},true);
document.addEventListener("pointermove",e=>{if(!mq)return;if(window.__hbLift){if(mq.box)mq.box.remove();mq=null;return}const dx=e.clientX-mq.x,dy=e.clientY-mq.y;if(!mq.on&&Math.abs(dx)+Math.abs(dy)<6)return;if(!mq.on){mq.on=true;mq.box=document.createElement("div");mq.box.id="fe-mq";document.body.appendChild(mq.box)}
  const l=Math.min(mq.x,e.clientX),tp=Math.min(mq.y,e.clientY),w=Math.abs(dx),h=Math.abs(dy);Object.assign(mq.box.style,{left:l+"px",top:tp+"px",width:w+"px",height:h+"px"});mq.r={l,t:tp,r:l+w,b:tp+h};
  document.querySelectorAll(".fe-mq-hit").forEach(x=>x.classList.remove("fe-mq-hit"));mqHits(mq.r).forEach(x=>x.classList.add("fe-mq-hit"))});
function mqHits(R){const all=[...document.querySelectorAll("main, header.top, .tabbar")].flatMap(z=>[...z.querySelectorAll(FE_SEL)]).filter(el=>{if(el.closest(ZX))return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.left>=R.l-1&&r.right<=R.r+1&&r.top>=R.t-1&&r.bottom<=R.b+1});
  return all.filter(el=>!all.some(o=>o!==el&&o.contains(el)))}
document.addEventListener("pointercancel",()=>{if(mq){if(mq.box)mq.box.remove();mq=null}document.querySelectorAll(".fe-mq-hit").forEach(x=>x.classList.remove("fe-mq-hit"))});
document.addEventListener("pointerup",e=>{if(!mq)return;const M=mq;mq=null;if(!M.on)return;M.box.remove();document.querySelectorAll(".fe-mq-hit").forEach(x=>x.classList.remove("fe-mq-hit"));window.__feMqAt=Date.now();
  const keys=mqHits(M.r).map(el=>{const p=fePath(el);return p?pvKey()+"|"+p:null}).filter(Boolean);
  let S=M.add?feSet().slice():[];keys.forEach(k=>{if(!S.includes(k))S.push(k)});if(!S.length){ui.feSel=null;ui.feMulti=null}else{ui.feMulti=S.length>1?S:null;ui.feSel=S[S.length-1];ui.feScope=null}
  document.querySelectorAll(".fe-on").forEach(x=>x.classList.remove("fe-on"));feApplyText();if(S.length>1)toast(`تم تحديد ${S.length} عناصر`,"ok")});
})();

function customView(m){
  if(!isDir())return empty("التخصيص لمدير البرنامج فقط.");
  const tabs=[["design","الأشكال والقوالب"],["brand","الهوية والشعار والألوان"],["home","الصفحة الرئيسية"],["nav","القائمة العلوية"],["terms","المسميات"],["texts","استبدال النصوص"],["lists","القوائم"]];
  const t=ui.ctab||"design";let body="";
  if(t==="nav"){const r=ui.crole||"teacher";const items=roleNavItems(r);
    body=`<div class="card"><div class="card-h"><div class="row"><h2>قائمة</h2><select data-change="crole" id="c-role">${Object.entries(ROLE).map(([k,l])=>`<option value="${k}" ${k===r?"selected":""}>${esc(l)}</option>`).join("")}</select></div><button class="btn sm" data-act="navReset" data-r="${r}">إعادة الافتراضي</button></div>
    <p class="hint" style="margin-bottom:10px">اسحب أي قسم من المقبض <b>⠿</b> لأعلى أو لأسفل لترتيبه. رتّب أقسام القائمة العلوية لهذا الدور، وغيّر أسماءها، وأخفِ ما لا يحتاجه. ما يظهر هنا محكوم أيضاً بصلاحيات الدور. ويستطيع كل مستخدم ترتيب قائمته الشخصية من زر الإعدادات بجانب اسمه.</p>
    <div class="clist" data-sort="nav" data-r="${r}">${items.map((it,i)=>`<div class="crow ${it.h?"off":""}" data-key="${it.k}"><button type="button" class="grip" aria-label="اسحب لإعادة الترتيب، أو استخدم الأسهم" title="اسحب لأعلى أو لأسفل">${GRIP}</button><span class="num muted"></span><input id="nl-${r}-${it.k}" value="${esc(it.l)}" data-change="navLabel" data-r="${r}" data-k="${it.k}" placeholder="${esc(it.dl)}" aria-label="اسم القسم"><span class="hint">${it.l!==it.dl?"الأصلي: "+esc(it.dl):""}</span><label class="row small"><input type="checkbox" id="ns-${r}-${it.k}" data-change="navShow" data-r="${r}" data-k="${it.k}" ${it.h?"":"checked"}> ظاهر</label></div>`).join("")}</div>
    <div class="navprev"><span class="hint">معاينة:</span>${items.filter(x=>!x.h).map((x,i)=>`<span class="${i===0?"on":""}">${esc(x.l)}</span>`).join("")}</div></div>`}
  else if(t==="home"){const g=ui.chome||"staff";const items=homeOrder(g);
    body=`<div class="card"><div class="card-h"><div class="row"><h2>الصفحة الرئيسية لـ</h2><select data-change="chome" id="c-home"><option value="staff" ${g==="staff"?"selected":""}>المعلمين والمشرفين</option><option value="student" ${g==="student"?"selected":""}>الطلاب</option><option value="parent" ${g==="parent"?"selected":""}>أولياء الأمور</option></select></div><button class="btn sm" data-act="homeReset" data-g="${g}">إعادة الافتراضي</button></div>
    <p class="hint" style="margin-bottom:10px">اسحب أي قسم من المقبض <b>⠿</b> لترتيبه. رتّب أقسام الصفحة الرئيسية وأخفِ ما لا تريده. الأقسام المتجاورة من نوع «نصف عرض» تظهر جنباً إلى جنب.</p>
    <div class="clist" data-sort="home" data-g="${g}">${items.map((it,i)=>`<div class="crow ${it.h?"off":""}" data-key="${it.k}"><button type="button" class="grip" aria-label="اسحب لإعادة الترتيب، أو استخدم الأسهم" title="اسحب لأعلى أو لأسفل">${GRIP}</button><span class="num muted"></span><b class="grow">${esc(it.l)}</b><button type="button" class="btn sm" data-act="homeW" data-g="${g}" data-k="${it.k}" title="بدّل بين العرض الكامل ونصف العرض">${it.full?"عرض كامل":"نصف عرض"} ⇄</button><label class="row small"><input type="checkbox" id="hs-${g}-${it.k}" data-change="homeShow" data-g="${g}" data-k="${it.k}" ${it.h?"":"checked"}> ظاهر</label></div>`).join("")}</div></div>`}
  else if(t==="terms"){const T=uiCfg().terms||{};
    body=`<p class="hint">غيّر أي مسمّى داخلي، فيتغير في كل مكان يظهر فيه. اترك الحقل فارغاً للعودة إلى الاسم الأصلي.</p><div class="grid g2">${TERM_DICTS().map(([n,label,,idx])=>`<div class="card"><div class="card-h"><h3>${label}</h3></div><div class="stack" style="gap:6px">${Object.keys(TDEF[n]).map(k=>{const dv=idx==null?TDEF[n][k]:TDEF[n][k][idx];return `<label class="trow"><span class="muted small">${esc(dv)}</span><input id="t-${n}-${k}" value="${esc((T[n]||{})[k]||"")}" placeholder="${esc(dv)}" data-change="term" data-d="${n}" data-k="${k}"></label>`}).join("")}</div></div>`).join("")}</div><div><button class="btn sm danger" data-act="termsReset">إعادة كل المسميات</button></div>`}
  else if(t==="texts"){const L=uiCfg().replace||[];
    body=`<div class="card"><div class="card-h"><h2>استبدال النصوص</h2><button class="btn sm pri" data-act="replAdd">إضافة استبدال</button></div><p class="hint" style="margin-bottom:10px">لتغيير أي عبارة تظهر في الواجهة، مثل «السجل اليومي» إلى «دفتر المتابعة». يُطبَّق على كل النصوص ما عدا نص المصحف الشريف وما يكتبه المستخدمون في الحقول.</p>
    ${L.length?`<div class="clist">${L.map((r,i)=>`<div class="crow"><input id="r-${i}-0" value="${esc(r[0]||"")}" placeholder="النص الحالي" data-change="repl" data-i="${i}" data-f="0"><span>←</span><input id="r-${i}-1" value="${esc(r[1]||"")}" placeholder="النص الجديد" data-change="repl" data-i="${i}" data-f="1"><button class="btn ghost sm danger" data-act="replDel" data-i="${i}">حذف</button></div>`).join("")}</div>`:empty("لا استبدالات بعد.")}</div>`}
  else if(t==="design"){body=designTabHTML()}
  else if(t==="lists"){const L=uiCfg().lists||{};
    body=`<div class="grid g2"><div class="card"><div class="card-h"><h2>أحكام التجويد</h2></div>${fld("حكم في كل سطر",`<textarea id="l-taj" data-change="listTaj" style="min-height:220px">${esc((L.tajweed&&L.tajweed.length?L.tajweed:TDEF.TAJ).join("\n"))}</textarea>`,"تظهر عند تسجيل المتابعة واختيار الأحكام التي تحتاج تدريباً")}</div>
    <div class="card"><div class="card-h"><h2>عناوين الشهادات المقترحة</h2></div>${fld("عنوان في كل سطر",`<textarea id="l-cert" data-change="listCert" style="min-height:220px">${esc((L.certs&&L.certs.length?L.certs:CERT_SUG).join("\n"))}</textarea>`,"تظهر كاقتراحات عند إصدار شهادة")}</div></div>`}
  else{const b=brand();
    body=`<div class="grid g2">${brandIdCards()}<div class="card"><div class="card-h"><h2>النصوص</h2></div><div class="stack">${fld("السطر أعلى اسم الحلقة",`<input id="b-tag" value="${esc(b.tagline)}" data-change="brand" data-k="tagline">`,"اتركه فارغاً لإخفائه")}${fld("العبارة فوق التحية",`<input id="b-verse" value="${esc(b.verse)}" data-change="brand" data-k="verse">`,"آية أو حديث، أو اتركه فارغاً")}<label class="switch" style="border:0;padding:0"><span>إخفاء الشعار من الشريط العلوي</span><input type="checkbox" id="b-logo" data-change="brandLogo" ${b.hideLogo?"checked":""}></label><p class="hint">اسم الحلقة نفسه يُعدَّل من «الإدارة».</p></div></div>
    ${colorsCardHTML(b)}${fontsCardHTML(b)}</div>`}
  return `<div class="hero"><div><h1>التخصيص</h1><div class="date">رتّب وسمِّ وغيّر الواجهة كما تريد، ثم اضغط «حفظ التعديلات» لتظهر للجميع</div></div></div>
  <div class="subtabs">${tabs.map(([k,l])=>`<button data-act="ctab" data-v="${k}" class="${t===k?"on":""}">${l}</button>`).join("")}</div><div data-noreplace class="stack" style="gap:16px">${body}</div>`;
}
function myNavModal(items){
  const m=me();items=items||navItems(m,baseNav(m),false).filter(x=>!x.h).map(x=>({k:x.k,l:x.l,h:!!x.ph}));
  const body=`<p class="hint">اسحب أي قسم من المقبض <b>⠿</b> لأعلى أو لأسفل، وأخفِ ما لا تستخدمه. هذا الترتيب لك وحدك.</p><div class="clist" data-sort="mynav">${items.map((it,i)=>`<div class="crow ${it.h?"off":""}" data-key="${it.k}"><button type="button" class="grip" aria-label="اسحب لإعادة الترتيب، أو استخدم الأسهم" title="اسحب لأعلى أو لأسفل">${GRIP}</button><span class="num muted"></span><b class="grow">${esc(it.l)}</b><label class="row small"><input type="checkbox" data-change="myNavShow" data-i="${i}" id="mn-${it.k}" ${it.h?"":"checked"}> ظاهر</label></div>`).join("")}</div>`;
  openModal("ترتيب قائمتي",body,"myNav",{items},"حفظ",`<button type="button" class="btn" data-act="myNavReset">الترتيب الافتراضي</button>`);
}

/* ============ واجهة الجوال للطالب وولي الأمر ============ */
const isApp=m=>!!m&&m.status==="active"&&(m.role==="student"||m.role==="parent")&&!isStaff(m);
const SV=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const NAVICON={today:SV('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),plan:SV('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),mushaf:SV('<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/>'),recite:SV('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),programs:SV('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),sessions:SV('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),record:SV('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),board:SV('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),child:SV('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5"/>'),notes:SV('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'),home:SV('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),daily:SV('<path d="M9 11l2 2 4-4"/><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 17h8"/>'),students:SV('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5"/>'),circles:SV('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7" r="1.5"/><circle cx="7" cy="14" r="1.5"/><circle cx="17" cy="14" r="1.5"/>'),reports:SV('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),admin:SV('<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>'),perms:SV('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),custom:SV('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),settings:SV('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),more:SV('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>')};
function appTabs(m){const nav=navFor(m);if(nav.length<=5)return{bar:nav,more:[]};return{bar:[...nav.slice(0,4),["more","المزيد"]],more:nav.slice(4)}}
function bottomBar(m,cls){
  const{bar,more}=appTabs(m);const v=ui.view;const inMore=more.some(x=>x[0]===v)||v==="more";
  return `<nav class="tabbar ${cls||""}" aria-label="التنقل"><div class="in" style="--n:${bar.length}">${bar.map(([k,l])=>{const on=k===v||(k==="more"&&inMore)||(k==="programs"&&v==="program")||(k==="child"&&v==="report")||(k==="students"&&v==="student")||(k==="circles"&&v==="circle")||(k==="reports"&&v==="report"&&isStaff(m));return `<button data-act="go" data-v="${k}" class="${on?"on":""}" aria-current="${on?"page":"false"}"><span class="ti">${NAVICON[k]||NAVICON.more}</span><span>${esc(l)}</span></button>`}).join("")}</div></nav>`;
}
function moreView(m){
  const{more}=appTabs(m);const circ=m.role==="student"?get("circles",m.circleId):null;
  return `<div class="card me-card"><div class="avatar" style="width:52px;height:52px;font-size:1.1rem">${avIn(m)}</div><div style="min-width:0"><h2>${esc(m.name)}</h2><div class="small muted">${ROLE[m.role]}${m.role==="student"?" · "+(TRACK[m.track]||""):""}${circ?" · "+esc(circ.name):""}${isStaff(m)?" · "+esc(myCircles(m).map(c=>c.name).join("، ")):""}</div></div></div>
  ${more.length?`<div class="menu">${more.map(([k,l])=>`<button class="mrow" data-act="go" data-v="${k}"><span class="ti">${NAVICON[k]||NAVICON.more}</span><b>${esc(l)}</b><span class="chev">‹</span></button>`).join("")}</div>`:""}
  <div class="card"><div class="row between"><b>المظهر</b><div class="seg modeseg">${[["system","تلقائي"],["light","فاتح"],["dark","ليلي"]].map(([k,l])=>`<button data-act="themeSet" data-v="${k}" class="${getThemeMode()===k?"on":""}">${l}</button>`).join("")}</div></div></div>
  <div class="menu"><button class="mrow" data-act="myNav"><span class="ti">${ICON.gear}</span><b>ترتيب قائمتي</b><span class="chev">‹</span></button><button class="mrow" data-act="changePass"><span class="ti">${NAVICON.perms||ICON.gear}</span><b>تغيير كلمة المرور</b><span class="chev">‹</span></button><button class="mrow" data-act="logout"><span class="ti" style="color:var(--bad)">${NAVICON.more}</span><b style="color:var(--bad)">تسجيل الخروج</b><span class="chev">‹</span></button></div>
  <details class="fold"><summary>أضف المنصة إلى شاشة جوالك</summary><div class="stack small" style="padding-top:8px"><p><b>آيفون:</b> افتح الرابط في Safari، ثم زر المشاركة <span class="muted">(المربع والسهم)</span>، ثم «إضافة إلى الشاشة الرئيسية».</p><p><b>أندرويد:</b> افتح الرابط في Chrome، ثم القائمة <span class="muted">(⋮)</span>، ثم «إضافة إلى الشاشة الرئيسية».</p><p class="muted">تظهر لك أيقونة تفتح المنصة مباشرة مثل التطبيق.</p></div></details>`;
}

/* ============ أنواع الأخطاء: خطأ، تنبيه، تلقين ============ */
const MK={t:["تنبيه","mk-t","p-yel"],l:["تلقين","mk-l","p-bad"]};
const CLUS=w=>w.match(/\P{M}\p{M}*/gu)||[w];
const HARAKA={"َ":"فتحة","ُ":"ضمة","ِ":"كسرة","ّ":"شدة","ْ":"سكون","ۡ":"سكون","ً":"تنوين فتح","ٌ":"تنوين ضم","ٍ":"تنوين كسر","ࣰ":"تنوين فتح","ࣱ":"تنوين ضم","ࣲ":"تنوين كسر","ٰ":"ألف خنجرية","ٓ":"مدّ","ٔ":"همزة","ٕ":"همزة","ۢ":"ميم صغيرة","ۭ":"ميم صغيرة","ۥ":"واو صغيرة","ۦ":"ياء صغيرة","ۧ":"ياء صغيرة","ۨ":"نون صغيرة","۟":"صفر مستدير","۠":"صفر مستطيل","۪":"إمالة","۫":"إشمام","۬":"تسهيل"};
function wordHTML(g,wi,w){const k=g+":"+wi;const mk=ui.marks[k];
  let inner=w;if(mk&&mk.c!=null){const cl=CLUS(w);inner=cl.map((x,i)=>i===mk.c?`<span class="mc">${x}</span>`:x).join("")}
  return `<span class="w ${mk?MK[MT(mk.t)][1]:""} ${ui.mpick===k?"wsel":""}" data-act="word" data-k="${k}" role="button" tabindex="0">${inner}</span>`}
function markDesc(k,m){const[g,wi]=k.split(":").map(Number);const w=wtext(g,wi);const[si,a]=sa(g);const cl=CLUS(w);let s=`${Q.s[si][0]} ${a}: «${w}»`;
  if(m.c!=null&&cl[m.c]){const ch=[...cl[m.c]];const hm=m.h!=null?ch[m.h+1]:null;s+=` (الحرف ${ch[0]}${hm&&HARAKA[hm]?"، "+HARAKA[hm]:""})`}return s}
function pickerHTML(){const k=ui.mpick;const m=ui.marks[k];if(!m||!Q)return"";const[g,wi]=k.split(":").map(Number);const w=wtext(g,wi);const[si,a]=sa(g);const cl=CLUS(w);
  const hs=m.c!=null&&cl[m.c]?[...cl[m.c]].slice(1).map((ch,i)=>[i,HARAKA[ch]]).filter(x=>x[1]):[];
  const tip=m.c==null?"الخطأ على الكلمة كاملة — اختر الحرف لتحديده بدقة":hs.length&&m.h==null?"اختر الحركة، أو اترك الحرف كاملاً":m.h!=null?"الخطأ على حركة هذا الحرف":"الخطأ على هذا الحرف";
  return `<div class="mpick mpc mpk-${MT(m.t)}" role="dialog" aria-label="تحديد موضع الملاحظة" title="${tip}"><div class="mp-head"><b class="mp-tt">${esc(Q.s[si][0])} · ${AR_D(a)}</b><div class="seg modeseg mp-types">${Object.entries(MK).map(([t,[l]])=>`<button data-act="mpType" data-v="${t}" class="mt-${t} ${MT(m.t)===t?"on":""}"><span class="dot"></span>${l}</button>`).join("")}</div><button class="btn sm ghost mp-del" data-act="mpDel" aria-label="إزالة الملاحظة" title="إزالة"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button><button class="btn sm pri mp-done" data-act="mpDone">تم</button></div>
  <div class="mp-row"><div class="mp-word" lang="ar" style="--n:${cl.length}">${cl.map((x,i)=>`<button type="button" class="cl ${m.c===i?"on":""}" data-act="mpClus" data-c="${i}" aria-label="الحرف ${i+1}">${x}</button>`).join("")}</div>${hs.length?`<i class="mp-sep" aria-hidden="true"></i><div class="mp-hars">${hs.map(([i,n])=>`<button type="button" class="chip-b ${m.h===i?"on":""}" data-act="mpHar" data-h="${i}">${n}</button>`).join("")}</div>`:""}</div></div>`}
const EC=l=>({e:l&&l.errs!=null&&l.errs!==""?n0(l.errs):n0(l&&l.errJali)+n0(l&&l.errKhafi),t:n0(l&&l.tanbih),l:n0(l&&l.talqin)});
const errShort=l=>{const c=EC(l);return [c.t?`تنبيه ${c.t}`:"",c.l?`تلقين ${c.l}`:""].filter(Boolean).join(" · ")||"—"};
const errFields=l=>{const c=EC(l||{});return fld("تنبيه",inp("tanbih",c.t||"","number","min=0"))+fld("تلقين",inp("talqin",c.l||"","number","min=0"))};

/* ============ الهدف والخطة التفصيلية ============ */
const SN=i=>SURAHS[i-1]?SURAHS[i-1].n:"";
const surahIdx=n=>{if(n==null||n==="")return 0;if(/^\d+$/.test(String(n)))return +n;const i=SURAHS.findIndex(x=>x.n===String(n).replace(/^سورة\s+/,"").trim());return i+1};
const surahNumSel=(name,v)=>sel(name,[["","—"],...SURAHS.map((x,i)=>[i+1,`${i+1}. ${x.n}`])],v);
const taskTitle=t=>{const ti=String(t.title||"");if(!t.surah||!n0(t.fromA)||/الآية|الآيات/.test(ti))return ti;const a=n0(t.fromA),b=n0(t.toA)||a;const base=ti.includes(SN(t.surah))?ti:`${ti} سورة ${SN(t.surah)}`.trim();return a===b?`${base} الآية ${a}`:`${base} من الآية ${a} إلى الآية ${b}`};
const taskRng=t=>{if(!t.surah)return"";if(/الآية/.test(taskTitle(t)))return"";const r=n0(t.fromA)?`من الآية ${t.fromA} إلى الآية ${n0(t.toA)||t.fromA}`:"";return String(t.title||"").includes(SN(t.surah))?r:`سورة ${SN(t.surah)}${r?" · "+r:""}`};
function rangeTxt(s1,a1,s2,a2){if(!s1||!SURAHS[s1-1])return"";if(s2&&s2!==s1&&SURAHS[s2-1])return `من سورة ${SN(s1)} الآية ${a1||1} إلى سورة ${SN(s2)} الآية ${a2||SURAHS[s2-1].a}`;return `سورة ${SN(s1)} من الآية ${a1||1} إلى الآية ${a2||SURAHS[s1-1].a}`}
function goalSet(p){const s1=n0(p.gFromS),s2=n0(p.gToS);if(!s1||!s2||!SURAHS[s1-1]||!SURAHS[s2-1])return null;const a1=n0(p.gFromA)||1,a2=n0(p.gToA)||SURAHS[s2-1].a;
  const set=new Set();const add=(s,f,t)=>{for(let a=f;a<=t;a++)set.add(s+":"+a)};
  if(s1===s2)add(s1,Math.min(a1,a2),Math.max(a1,a2));
  else if(s1<s2){add(s1,a1,SURAHS[s1-1].a);for(let s=s1+1;s<s2;s++)add(s,1,SURAHS[s-1].a);add(s2,1,a2)}
  else{add(s1,a1,SURAHS[s1-1].a);for(let s=s1-1;s>s2;s--)add(s,1,SURAHS[s-1].a);add(s2,1,a2)}
  return set}
function goalInfo(s){const p=s.plan||{};const isT=s.track==="tilawa";const G=goalSet(p);const d=today();const from=p.startDate||"",to=p.endDate||"";
  let done=0,total=0,unit="آية";
  if(G){total=G.size;const hit=new Set();const mark=(sn,f,t)=>{const si=surahIdx(sn);f=n0(f);t=n0(t)||f;if(!si)return;if(!f){f=1;t=SURAHS[si-1]?SURAHS[si-1].a:0}for(let a=Math.min(f,t);a<=Math.max(f,t);a++){const k=si+":"+a;if(G.has(k))hit.add(k)}};
    logsOf(s.id,from||null,null).forEach(l=>{if(isT)mark(l.tSurah,l.tFrom,l.tTo);else mark(l.newSurah,l.newFrom,l.newTo)});
    S.tasks.filter(t=>t.studentId===s.id&&t.done&&t.surah&&n0(t.fromA)&&(t.kind==="hifz"||t.kind==="tilawa")&&(!from||t.date>=from)).forEach(t=>mark(t.surah,t.fromA,t.toA));
    done=hit.size}
  else{const tgt=n0(p.targetPages)-n0(p.basePages);if(tgt>0){total=tgt;done=Math.max(0,totalPages(s)-n0(p.basePages));unit="وجه"}}
  const pct=total?Math.min(100,Math.round(done/total*100)):null;
  let tp=null,left=null;if(from&&to){const span=(new Date(to)-new Date(from))/864e5,el=(new Date(d)-new Date(from))/864e5;tp=span>0?Math.max(0,Math.min(100,Math.round(el/span*100))):null;left=Math.max(0,Math.round((new Date(to)-new Date(d))/864e5))}
  return{p,G,done,total,unit,pct,tp,left,from,to,range:G?rangeTxt(n0(p.gFromS),n0(p.gFromA)||1,n0(p.gToS),n0(p.gToA)||SURAHS[n0(p.gToS)-1].a):""}}
function pctRing(p){const size=96,r=size/2-8,C=2*Math.PI*r,v=Math.min(1,(p||0)/100);return `<div class="ring" style="width:${size}px;height:${size}px" role="img" aria-label="نسبة الإنجاز ${p??0}%"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="8"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${v>=1?"var(--ok)":"var(--accent)"}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-v)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg><div class="ring-t"><b class="num">${p==null?"—":p+"%"}</b></div></div>`}
function goalCard(s,self){if(!s||!s.plan)return"";const g=goalInfo(s);const p=g.p;if(!p.goal&&g.pct==null&&!g.from)return"";
  const st=g.pct==null||g.tp==null?null:g.pct>=g.tp+5?["متقدم على الخطة","p-ok"]:g.pct>=g.tp-10?["على المسار","p-pri"]:["متأخر عن الخطة","p-warn"];
  return `<section class="card goal-card"><div class="card-h"><h2>${self?"هدفي":"الهدف"}</h2>${st?`<span class="pill ${st[1]}">${st[0]}</span>`:""}</div>
  <div class="goal-in">${pctRing(g.pct)}<div class="stack" style="gap:6px;min-width:0;flex:1">
  ${p.goal?`<b class="goal-t">${esc(p.goal)}</b>`:""}${g.range?`<div class="small">${esc(g.range)}</div>`:""}
  ${g.from||g.to?`<div class="small muted num">من ${g.from?fmtShort(g.from):"—"} إلى ${g.to?fmtShort(g.to):"—"}${g.left!=null?` · باقي ${g.left} يوماً`:""}</div>`:""}
  ${g.total?`<div class="small">أُنجز <b class="num">${g.done}</b> من <b class="num">${g.total}</b> ${g.unit}</div>`:""}</div></div>
  ${g.tp!=null?`<div class="goal-bars"><div class="small row between"><span>الإنجاز</span><b class="num">${g.pct??0}%</b></div>${pbar(g.pct||0,100)}<div class="small muted row between"><span>الوقت المنقضي من المدة</span><span class="num">${g.tp}%</span></div><div class="tbar">${pbar(g.tp,100)}</div></div>`:""}</section>`}
function upcomingHTML(s,days){const d0=today();const out=[];for(let i=1;i<=days;i++){const d=addDays(d0,i);const T=tasksOf(s.id,d,d);if(T.length)out.push([d,T])}
  if(!out.length)return"";
  return `<div class="updays">${out.map(([d,T])=>`<div class="upday"><div class="ud-h"><b>${fmtD(d,{weekday:"long"})}</b><span class="num small muted">${fmtD(d,{day:"numeric",month:"long"})}</span></div><div class="stack" style="gap:6px">${T.map(t=>`<div class="ud-t">${kindTag(t.kind)}<div class="grow" style="min-width:0"><div class="t">${esc(taskTitle(t))}</div>${t.surah?`<div class="small rng row" style="gap:8px">${esc(taskRng(t))}${listenBtn(t)}</div>`:""}${t.details?`<div class="small muted" style="white-space:pre-wrap">${esc(t.details)}</div>`:""}</div></div>`).join("")}</div></div>`).join("")}</div>`}
const visProgs=s=>S.programs.filter(p=>!p.hidden&&progForS(p,s)).filter(p=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track));
function studentPlan(m){
  const d=ui.pday||today();const T=tasksOf(m.id,d,d);const t0=today();
  const lbl=d===t0?"اليوم":d===addDays(t0,1)?"غداً":d===addDays(t0,2)?"بعد غد":d===addDays(t0,-1)?"أمس":fmtD(d,{weekday:"long"});
  const strip=[];for(let i=-3;i<=3;i++){const x=addDays(d,i);const TT=tasksOf(m.id,x,x);strip.push(`<button class="dstrip-d ${x===d?"on":""} ${x===t0?"is-today":""}" data-act="pday" data-v="${x}" aria-label="${fmtD(x)}"><span>${fmtD(x,{weekday:"short"})}</span><b class="num">${fmtD(x,{day:"numeric"})}</b><i class="${TT.length?(TT.every(t=>t.done)?"ok":"has"):""}"></i></button>`)}
  const P=visProgs(m);
  return `<div class="app-stack"><div class="hero"><div><h1>خطتي</h1><div class="date">تنقّل بين الأيام لترى مقرر كل يوم</div></div></div>
  ${goalCard(m,true)}
  <section class="card"><div class="dnav"><button class="btn sm" data-act="pdayN" data-n="-1" aria-label="اليوم السابق">→</button><div class="grow" style="text-align:center"><b>${lbl}</b><div class="small muted num">${fmtD(d,{weekday:"long",day:"numeric",month:"long"})}</div></div><button class="btn sm" data-act="pdayN" data-n="1" aria-label="اليوم التالي">←</button></div>
  <div class="dstrip">${strip.join("")}</div>
  ${d!==t0?`<div class="row" style="justify-content:center"><button class="btn ghost sm" data-act="pday" data-v="${t0}">العودة إلى اليوم</button></div>`:""}
  ${schedDayHTML(m,d,T)}<div class="stack" style="gap:8px;margin-top:10px">${T.length?T.map(t=>taskTap(t,d>t0)).join(""):empty(d>t0?"لا مقرر مسجّل لهذا اليوم بعد.":"لا مقرر في هذا اليوم.")}</div></section>
  ${(()=>{const lg=get("logs",`${m.id}_${d}`);if(!lg||d>t0)return"";const nh=cfg().studentSeeNotes?logNotesHTML(lg,"student"):marksBlock(lg.marks)?`<div class="nsecs">${marksBlock(lg.marks)}</div>`:"";return `<section class="card"><div class="card-h"><h2>متابعة المعلم لهذا اليوم</h2><span class="pill ${ATT_CLS[lg.attendance]||""}">${ATT[lg.attendance]||"—"}</span></div>${amountTxt(lg)!=="—"?`<div class="small">${amountTxt(lg)}</div>`:""}${cfg().studentSeeGrades&&errShort(lg)!=="—"?`<div class="row" style="gap:6px;margin-top:6px"><span class="pill">${errShort(lg)}</span></div>`:""}${nh||`<p class="small muted" style="margin:8px 0 0">لا ملاحظات مسجلة.</p>`}</section>`})()}
  ${P.length?`<section class="card"><div class="card-h"><h2>البرامج المصاحبة</h2></div>${studentPrograms(m)}</section>`:""}
  ${m.track==="tilawa"?khatmaHTML(m,false):""}${planView(m)}${juzMapHTML(m,false)}</div>`;
}
async function ensureQ(){if(Q)return true;loadQuran();try{if(QLOAD&&QLOAD.then)await QLOAD}catch(e){}return !!Q}
const PGW={};
function pageW(pg){if(PGW[pg])return PGW[pg];const f=Q.p[pg-1],t=(pg<604?Q.p[pg]:Q.v.length)-1;let tot=0;for(let y=f;y<=t;y++)tot+=Q.v[y].length;return PGW[pg]=tot||1}
function chunkFrom(s,a,amt,unit){const n=SURAHS[s-1].a;let a2=a;
  if(unit==="ayah")a2=Math.min(n,a+Math.max(1,Math.round(amt))-1);
  else if(Q){let w=0;for(let x=a;x<=n;x++){const g=Q.ss[s-1]+x-1;w+=Q.v[g].length/pageW(pageOf(g));a2=x;if(w>=amt-0.04)break}}
  else a2=Math.min(n,a+Math.max(1,Math.round(amt*15))-1);
  return{s,a1:a,a2}}
/* ===== خطة المراجعة (اختيارية) ===== */
function revSection(p,dir){const v=p.rev||{};const on=!!v.on;const rd=v.dir||dir;const dS=rd==="up"?[114,1,78,40]:[1,1,2,286];
  const fS=n0(v.fS)||n0(p.gFromS)||dS[0],fA=n0(v.fA)||1,tS=n0(v.tS)||dS[2],tA=n0(v.tA)||SURAHS[tS-1].a;
  const aN=v.u==="page"?n0(v.n)||n0(v.amt)/15:n0(v.n)||(n0(v.amt)||"");const aU=v.u||"page";const Q=[[15,"وجه"],[30,"وجهان"],[45,"3 أوجه"],[75,"ربع جزء"],[150,"نصف جزء"],[300,"جزء"]];
  return `<fieldset><legend>٤. خطة المراجعة <span class="hint">(اختيارية)</span></legend><label class="switch" style="border:0;padding:0"><span><b>إضافة خطة مراجعة لهذا الطالب</b><br><span class="hint">تُوزَّع المراجعة على الأيام تلقائياً، وتعود إلى البداية عند إتمام الدورة</span></span><input type="checkbox" name="revOn" id="f-revOn" ${on?"checked":""}></label>
  <div id="rev-box" class="stack" ${on?"":"hidden"} style="margin-top:10px"><div class="seg2">${[["down","نزولاً","من الأعلى في المصحف"],["up","صعوداً","من الناس فما فوق"]].map(([k,l,h])=>`<label class="segopt"><input type="radio" name="revDir" value="${k}" ${rd===k?"checked":""}><span><b>${l}</b><small>${h}</small></span></label>`).join("")}</div>
  <div class="fg">${fld("مراجعة من سورة",surahNumSel("rFromS",fS))}${fld("من الآية",inp("rFromA",fA,"number","min=1"))}${fld("إلى سورة",surahNumSel("rToS",tS))}${fld("حتى الآية",inp("rToA",tA,"number","min=1"))}</div>
  <div class="chips qrev">${Q.map(([x,l])=>`<button type="button" class="chip-b ${(aU==="page"?+aN*15:+aN)===x?"on":""}" data-act="revPick" data-v="${x}">${l}</button>`).join("")}</div>
  <div class="fg">${fld("مقدار المراجعة اليومي",inp("revN",aN,"number","min=0.5 step=0.5"))}${fld("الوحدة",sel("revU",[["page","وجه"],["line","سطر"]],aU))}</div>
  <div><div class="small muted" style="margin-bottom:6px">أيام المراجعة</div><div class="chips">${DAYS.map((d,i)=>`<label><input type="checkbox" name="revDays" value="${i}" ${(v.days||p.days||[0,1,2,3,4]).includes(i)?"checked":""}>${d}</label>`).join("")}</div></div>
  <div class="plan-est" id="rev-est" aria-live="polite"></div>
  ${on&&n0(v.nextS)?`<label class="switch" style="border:0;padding:0"><span>إعادة المراجعة من بداية النطاق (الموضع الحالي: سورة ${SN(n0(v.nextS))} الآية ${n0(v.nextA)||1})</span><input type="checkbox" name="revReset" id="f-revReset"></label>`:""}</div></fieldset>`}
function revFromForm(fd){const u=fd.get("revU")||"page",n=parseFloat(fd.get("revN"))||0;
  return{on:!!fd.get("revOn"),dir:fd.get("revDir")||"down",fS:n0(fd.get("rFromS")),fA:n0(fd.get("rFromA"))||1,tS:n0(fd.get("rToS")),tA:n0(fd.get("rToA")),n,u,amt:n*(u==="page"?15:1),days:fd.getAll("revDays").map(Number)}}
const revRangeTxt=c=>c.s1===c.s2?`سورة ${SN(c.s1)} من الآية ${c.a1} إلى الآية ${c.a2}`:`من سورة ${SN(c.s1)} الآية ${c.a1} إلى سورة ${SN(c.s2)} الآية ${c.a2}`;
function revEstimate(v){if(!v||!n0(v.fS)||!n0(v.tS)||!n0(v.amt))return null;if(!mqAL())return{loading:true};const total=rangeLines(n0(v.fS),n0(v.fA)||1,n0(v.tS),n0(v.tA)||SURAHS[n0(v.tS)-1].a);const need=Math.max(1,Math.ceil(total/n0(v.amt)-0.05));const per=(v.days||[]).length||5;return{total,need,weeks:need/per}}
function revEstHTML(p){const v=p.rev;if(!v||!v.on)return"";const e=revEstimate(v);if(!e)return `<div class="small muted">حدّد النطاق والمقدار لحساب الدورة.</div>`;if(e.loading)return `<div class="small muted">جاري حساب الأسطر…</div>`;
  return `<div class="pe-g"><div><span>نطاق المراجعة</span><b class="num">${(e.total/15).toFixed(1)} وجه</b><small class="num">${Math.round(e.total)} سطراً</small></div><div><span>الدورة الكاملة</span><b class="num">${e.need}</b><small>يوم مراجعة</small></div><div><span>تقريباً</span><b class="num">${e.weeks<1.5?Math.round(e.weeks*7)+" أيام":Math.round(e.weeks)+" أسابيع"}</b><small>ثم تبدأ من جديد</small></div></div>`}
function revChunk(v,pos){const al=mqAL();if(!al||!pos)return null;const fS=n0(v.fS),fA=n0(v.fA)||1,tS=n0(v.tS),tA=n0(v.tA)||SURAHS[tS-1].a;const up=v.dir==="up";const target=n0(v.amt);
  const seq=segs(fS,fA,tS,tA);const flat=[];seq.forEach(([s,a,e])=>{for(let x=a;x<=e;x++)flat.push([s,x])});if(!flat.length)return null;
  let i=flat.findIndex(([s,a])=>s===pos[0]&&a===pos[1]);let wrap=false;if(i<0){i=0;wrap=true}
  const st=i;let cum=0,j=i;
  for(;j<flat.length;j++){const v2=al[gOf(flat[j][0],flat[j][1])];if(cum+v2>=target){if(j===st||(cum+v2-target)<(target-cum)){cum+=v2}else j--;break}cum+=v2}
  if(j>=flat.length)j=flat.length-1;
  {const [s]=flat[j];let k=j+1,r=0;while(k<flat.length&&flat[k][0]===s){r+=al[gOf(flat[k][0],flat[k][1])];k++}if(k>j+1&&r<5){cum+=r;j=k-1}}
  const end=j+1>=flat.length;const next=end?flat[0]:flat[j+1];
  return{s1:flat[st][0],a1:flat[st][1],s2:flat[j][0],a2:flat[j][1],ln:cum,next,wrap:wrap||st===0&&n0(v.nextS)>0,wrapNext:end}}
function chunkLines(s,a,target,first,gS,gA){const al=mqAL();const lim=gS===s?Math.min(SURAHS[s-1].a,gA):SURAHS[s-1].a;let cum=0,end=a-1;
  if(!first){let all=0;for(let x=a;x<=lim;x++)all+=al[gOf(s,x)];if(all<=target+1.5)return{s,a1:a,a2:lim,ln:all};if(all<target*3+6)return null}
  for(let x=a;x<=lim;x++){const v=al[gOf(s,x)];if(cum+v>=target){const take=(first&&end<a)||(cum+v-target)<(target-cum);if(take){cum+=v;end=x}break}cum+=v;end=x}
  if(end>=a&&end<lim){let r=0;for(let x=end+1;x<=lim;x++)r+=al[gOf(s,x)];if(r<1.2){cum+=r;end=lim}}
  return end<a?null:{s,a1:a,a2:end,ln:cum}}
async function genWeek(sid,nd){nd=nd||7;const s=get("members",sid);const p=s&&s.plan;if(!p){toast("أنشئ الخطة أولاً","err");return}
  if(p.unit==="line"&&n0(p.gFromS)&&n0(p.amt))return genFromSchedule(s,nd);
  if(nd==="all"){if(!p.endDate){toast("حدد تاريخ نهاية الخطة أولاً","err");return}nd=Math.round((new Date(p.endDate)-new Date(today()))/864e5)+1;if(nd<1){toast("انتهت مدة الخطة","err");return}nd=Math.min(nd,800)}
  const kind=s.track==="tilawa"?"tilawa":"hifz";const amt=n0(p.amt);const LN=p.unit==="line";
  let pos=n0(p.nextS)?[n0(p.nextS),n0(p.nextA)||1]:n0(p.gFromS)?[n0(p.gFromS),n0(p.gFromA)||1]:surahIdx(p.startPoint)?[surahIdx(p.startPoint),1]:null;
  const smart=!!(pos&&amt);
  if(smart&&LN&&!(await ensureMQ())){toast("تعذّر تحميل المصحف لحساب الأسطر","err");return}
  if(smart&&!LN&&p.unit!=="ayah"&&!(await ensureQ())){toast("تعذّر تحميل المصحف لحساب الآيات","err");return}
  const rev=p.dir?p.dir==="up":n0(p.gFromS)&&n0(p.gToS)?n0(p.gFromS)>n0(p.gToS):p.direction==="من الناس صعوداً";
  const gS=n0(p.gToS),gA=n0(p.gToA)||(gS&&SURAHS[gS-1]?SURAHS[gS-1].a:0);
  const past=(x,a)=>!!gS&&(rev?(x<gS||(x===gS&&a>gA)):(x>gS||(x===gS&&a>gA)));
  const adv=c=>{if(c.a2<SURAHS[c.s-1].a)pos=[c.s,c.a2+1];else{const ns=rev?c.s-1:c.s+1;pos=ns>=1&&ns<=114?[ns,1]:null}};
  let n=0,ended=false,cyc=0;const days=p.days&&p.days.length?p.days:[0,1,2,3,4];const verb=kind==="tilawa"?"تلاوة":"حفظ";
  const RV=kind==="hifz"&&p.rev&&p.rev.on&&n0(p.rev.fS)&&n0(p.rev.amt)?p.rev:null;if(RV&&!(await ensureMQ())){toast("تعذّر تحميل المصحف لحساب المراجعة","err");return}
  let rpos=RV?(n0(RV.nextS)?[n0(RV.nextS),n0(RV.nextA)||1]:[n0(RV.fS),n0(RV.fA)||1]):null;const rdays=RV?(RV.days&&RV.days.length?RV.days:days):[];
  for(let i=0;i<nd;i++){const d=addDays(today(),i);if(p.endDate&&d>p.endDate)continue;if(p.startDate&&d<p.startDate)continue;
    const inRev=!!RV&&rdays.includes(dow(d));
    if(inRev&&!S.tasks.some(t=>t.studentId===sid&&t.date===d&&t.kind==="murajaa")){const c=revChunk(RV,rpos);if(c){put("tasks","t"+gen(),{studentId:sid,date:d,kind:"murajaa",title:"مراجعة "+revRangeTxt(c),details:`نحو ${lnTxt(Math.max(.5,Math.round(c.ln*2)/2))}${c.wrap?" · بداية دورة مراجعة جديدة":""}`,...(c.s1===c.s2?{surah:c.s1,fromA:c.a1,toA:c.a2}:{}),done:false,createdBy:me().id});n++;rpos=c.next;if(c.wrapNext)cyc++}}
    if(!days.includes(dow(d)))continue;
    const has=k=>S.tasks.some(t=>t.studentId===sid&&t.date===d&&t.kind===k);
    const mk=(k,title,extra,force)=>{if(!title||(!force&&has(k)))return false;put("tasks","t"+gen(),{studentId:sid,date:d,kind:k,title,details:"",done:false,createdBy:me().id,...(extra||{})});n++;return true};
    if(smart&&!ended){if(!has(kind)&&pos&&!past(pos[0],pos[1])){
      if(LN){let rem=amt,first=true;while(pos&&!past(pos[0],pos[1])&&rem>0.3){const c=chunkLines(pos[0],pos[1],rem,first,gS,gA);if(!c)break;
          mk(kind,`${verb} سورة ${SN(c.s)}`,{surah:c.s,fromA:c.a1,toA:c.a2,details:`نحو ${lnTxt(Math.max(.5,Math.round(c.ln*2)/2))}`},!first);rem-=c.ln;first=false;adv(c)}}
      else{const c=chunkFrom(pos[0],pos[1],amt,p.unit||"page");if(gS&&c.s===gS&&c.a2>gA)c.a2=gA;mk(kind,`${verb} سورة ${SN(c.s)}`,{surah:c.s,fromA:c.a1,toA:c.a2});adv(c)}
      if(!pos||past(pos[0],pos[1]))ended=true}}
    else if(!smart){if(kind==="tilawa")mk("tilawa","تلاوة "+(p.dailyTilawa||"الورد اليومي"));else mk("hifz","حفظ "+(p.dailyNew||"المقرر اليومي"))}
    if(kind==="hifz"&&!RV&&p.dailyRev)mk("murajaa","مراجعة "+p.dailyRev)}
  if(smart||RV){const np={...p};if(smart){np.nextS=pos?pos[0]:p.nextS;np.nextA=pos?pos[1]:p.nextA}if(RV)np.rev={...RV,nextS:rpos[0],nextA:rpos[1],cycle:(n0(RV.cycle)||0)+cyc};patch("members",sid,{plan:np})}
  toast(n?`أُنشئت ${n} مهمة${ended?"، ووصلت الخطة إلى نهايتها":""}`:ended?"وصلت الخطة إلى نهايتها":"المهام موجودة مسبقاً")}

/* ============ لوحة الشرف ============ */
const LBC={};
function lbRows(m,f,t){
  if(MODE==="live"&&!isStaff(m)&&typeof SB!=="undefined"&&SB){const k=f+"|"+t+"|"+(lbDiv(m)||"");const c=LBC[k];const fresh=c&&c.rows&&Date.now()-c.at<120000;
    if(!fresh&&!(c&&c.loading)){LBC[k]={...(c||{}),loading:true};(lbDiv(m)?SB.rpc("leaderboard_div",{p_from:f,p_to:t,p_div:lbDiv(m)}):SB.rpc("leaderboard",{p_from:f,p_to:t})).then(({data,error})=>{LBC[k]={at:Date.now(),rows:error?[]:(data||[]).map(r=>({s:{id:r.id,name:r.name,track:r.track},x:{points:r.points,tPages:+r.t_pages,newPages:+r.new_pages,rate:r.rate}}))};render()})}
    return c&&c.rows?c.rows:null}
  return allStudents().filter(s=>lbDivOk(m,s)).map(s=>({s,x:stats(s.id,f,t)})).sort((a,b)=>b.x.points-a.x.points)}
function rankRows(rows){let prev=null;return rows.map((r,i)=>{const rank=prev&&prev.x.points===r.x.points?prev.rank:i+1;const o={...r,rank};prev=o;return o})}
const lbVisible=m=>!!m&&(isStaff(m)||cfg().leaderboard);
const lbPts=m=>isStaff(m)||!!cfg().boardPoints;
const shortName=n=>String(n||"").trim().split(/\s+/).slice(0,2).join(" ");
function podiumHTML(R,hl,pts){const top=R.slice(0,3);if(!top.length||!top[0].x.points)return empty("لا توجد نقاط بعد في هذه الفترة.");
  const M=[["gold","المركز الأول"],["silver","المركز الثاني"],["bronze","المركز الثالث"]];
  const col=(r,i)=>r?`<div class="pod pod-${M[i][0]} ${hl.includes(r.s.id)?"me":""}"><div class="pod-av">${(()=>{const mm=get("members",r.s.id);return mm&&okPhoto(mm.photo)?`<img src="${esc(mm.photo)}" alt="">`:`<span>${esc(initials(r.s.name))}</span>`})()}<i class="medal num">${r.rank}</i></div><b class="pod-n">${esc(shortName(r.s.name))}</b><span class="pod-p ${pts?"num":""}">${pts?r.x.points+" نقطة":M[i][1]}</span><div class="pod-b"></div></div>`:`<div class="pod pod-empty"></div>`;
  return `<div class="podium">${col(top[1],1)}${col(top[0],0)}${col(top[2],2)}</div>`}
function boardCard(m,sid,who){if(!lbVisible(m))return"";const mo=today().slice(0,7);const[f,t]=monthRange(mo);const rows=lbRows(m,f,t);
  if(!rows)return `<section class="card board-card"><div class="card-h"><h2>لوحة الشرف</h2></div>${empty("جاري التحميل…")}</section>`;
  const R=rankRows(rows);const mine=R.find(r=>r.s.id===sid);
  if(who==="parent")return mine?`<section class="card board-card"><div class="card-h"><h2>ترتيب ابنك</h2><span class="small muted">${monthName(mo)}</span></div><div class="myrank"><span>مركز ابنك الحالي</span><b class="num">${mine.rank}</b><span class="small muted">من ${R.length} طالباً</span></div></section>`:"";
  return `<section class="card board-card"><div class="card-h"><h2>لوحة الشرف</h2><span class="small muted">${monthName(mo)}</span></div>${podiumHTML(R,[sid],lbPts(m))}
  ${mine?`<div class="myrank"><span>${who==="parent"?"مركز ابنك الحالي":"مركزك الحالي"}</span><b class="num">${mine.rank}</b><span class="small muted">من ${R.length} طالباً</span></div>`:""}
  <div class="row" style="justify-content:center"><button class="btn sm" data-act="go" data-v="board">لوحة الشرف كاملة</button></div></section>`}

function topStrip(m,sids,who){if(!lbVisible(m))return"";const mo=today().slice(0,7);const[f,t]=monthRange(mo);let rows=lbRows(m,f,t);
  if(!rows)return `<section class="card top3"><div class="card-h"><h2>الأوائل هذا الشهر</h2></div><div class="hint">جاري التحميل…</div></section>`;
  if(isStaff(m)){const mine=new Set(myStudents(m).map(s=>s.id));rows=rows.filter(r=>mine.has(r.s.id))}
  const R=rankRows(rows);const pts=lbPts(m);const top=R.slice(0,3).filter(r=>r.x.points>0);const md=["gold","silver","bronze"];
  const mine=sids.map(id=>R.find(r=>r.s.id===id)).filter(Boolean);
  if(who==="parent"){if(!mine.length)return"";return `<section class="card top3"><div class="card-h"><h2>ترتيب ${mine.length>1?"أبنائك":"ابنك"} هذا الشهر</h2><span class="small muted">${monthName(mo)}</span></div><div class="t3-me">${mine.map(r=>`<span>مركز ${esc(firstName(r.s.name))}</span><b class="num">${r.rank}</b><span class="small muted">من ${R.length}${pts?` · ${r.x.points} نقطة`:""}</span>`).join("")}</div></section>`}
  return `<section class="card top3 clickable" data-act="go" data-v="board" aria-label="لوحة الشرف"><div class="card-h"><h2>الأوائل هذا الشهر</h2><span class="small muted">${monthName(mo)}</span></div>
  ${top.length?`<div class="t3">${top.map((r,i)=>`<div class="t3-i t3-${md[i]} ${sids.includes(r.s.id)?"me":""}"><span class="t3-m num">${r.rank}</span><span class="t3-n">${esc(shortName(r.s.name))}</span>${pts?`<span class="t3-p num">${r.x.points} نقطة</span>`:""}</div>`).join("")}</div>`:`<div class="hint">لا توجد نقاط بعد هذا الشهر.</div>`}
  ${mine.length?`<div class="t3-me">${mine.map(r=>`<span>${who==="parent"?"مركز "+esc(firstName(r.s.name)):"مركزك"}</span><b class="num">${r.rank}</b><span class="small muted">من ${R.length}</span>`).join("")}</div>`:""}</section>`}

/* ============ الرسائل ============ */
const msgsOf=()=>S.messages||[];
function msgContacts(m){const out=new Map();const add=(x,sid,why)=>{if(!x||x.id===m.id||x.status!=="active")return;const c=out.get(x.id)||{x,sids:new Set(),why};if(sid)c.sids.add(sid);out.set(x.id,c)};
  if(isStaff(m)){S.members.filter(x=>x.status==="active"&&isStaff(x)).forEach(x=>add(x,null,"staff"));
    myStudents(m).forEach(s=>{add(s,s.id,"student");S.members.filter(p=>p.role==="parent"&&p.status==="active"&&(p.childIds||[]).includes(s.id)).forEach(p=>add(p,s.id,"parent"))})}
  else{const kids=m.role==="parent"?parentKids(m):m.role==="student"?[m]:[];
    kids.forEach(s=>{const c=get("circles",s.circleId);[get("members",s.teacherId),c&&get("members",c.teacherId),...S.members.filter(x=>x.status==="active"&&["supervisor","assistant"].includes(x.role)&&s.circleId&&(x.circleIds||[]).includes(s.circleId))].forEach(x=>add(x,s.id,"teacher"))});
    S.members.filter(x=>x.status==="active"&&(x.role==="director"||x.role==="admin")).forEach(x=>add(x,null,"admin"))}
  return [...out.values()]}
function threads(m){const T=new Map();msgsOf().forEach(x=>{if(x.fromId!==m.id&&x.toId!==m.id)return;const o=x.fromId===m.id?x.toId:x.fromId;const t=T.get(o)||{other:o,list:[],unread:0};t.list.push(x);if(x.toId===m.id&&!x.readAt)t.unread++;T.set(o,t)});
  T.forEach(t=>t.list.sort((a,b)=>String(a.at)<String(b.at)?-1:1));return [...T.values()].sort((a,b)=>String(a.list[a.list.length-1].at)<String(b.list[b.list.length-1].at)?1:-1)}
const unreadCount=m=>m?msgsOf().filter(x=>x.toId===m.id&&!x.readAt).length:0;
const msgWhen=iso=>{const d=String(iso||"").slice(0,10);if(!d)return"";const loc=ymd(new Date(iso));return loc===today()?fmtT(iso):fmtShort(loc)};
function inboxView(m){
  const TH=threads(m);const cur=ui.thr;
  if(cur){const other=get("members",cur);const t=TH.find(x=>x.other===cur)||{list:[],unread:0};
    if(t.unread)setTimeout(()=>t.list.filter(x=>x.toId===m.id&&!x.readAt).forEach(x=>patch("messages",x.id,{readAt:new Date().toISOString()})),60);
    const C=msgContacts(m).find(c=>c.x.id===cur);const sids=C?[...C.sids]:[];
    const kidsSel=m.role==="parent"&&sids.length>1;
    return `<div class="app-stack"><div class="chat-h"><button class="btn ghost sm" data-act="thrBack" aria-label="رجوع إلى الرسائل">→</button><div class="avatar">${avIn(other)}</div><div class="grow" style="min-width:0"><b>${esc(other?other.name:"مستخدم")}</b><div class="small muted">${other?ROLE[other.role]||"":""}${other&&other.role==="parent"&&sids.length?" · ولي أمر "+sids.map(id=>esc(firstName(nameOf(id)))).join("، "):""}</div></div></div>
    <div class="chat" id="chat">${t.list.length?t.list.map(x=>`<div class="bub ${x.fromId===m.id?"out":"in"}">${x.studentId&&x.studentId!==x.fromId&&x.studentId!==x.toId&&((m.role==="parent"&&parentKids(m).length>1)||(isStaff(m)&&other&&other.role==="parent"&&(other.childIds||[]).length>1))?`<span class="bub-tag">بخصوص ${esc(firstName(nameOf(x.studentId)))}</span>`:""}<div class="bub-t">${esc(x.body)}</div><span class="bub-m">${msgWhen(x.at)}${x.fromId===m.id&&x.readAt?" · قُرئت":""}</span></div>`).join(""):`<div class="empty">ابدأ المحادثة بكتابة رسالتك.</div>`}</div>
    ${C||t.list.length?`<form class="chat-f" data-form="msg">${kidsSel?sel("studentId",sids.map(id=>[id,"بخصوص "+nameOf(id)]),sids[0]):""}<div class="chat-in"><textarea name="body" id="f-msgbody" required maxlength="2000" rows="2" placeholder="اكتب رسالتك…"></textarea><button class="btn pri">إرسال</button></div></form>`:""}</div>`}
  const C=msgContacts(m);
  return `<div class="app-stack"><div class="hero"><div><h1>الرسائل</h1><div class="date">${isStaff(m)?"تواصل مع الطلاب وأولياء الأمور والزملاء":"تواصل مع المعلم والإدارة"} داخل المنصة</div></div><div class="row"><button class="btn pri" data-act="msgNew">رسالة جديدة</button></div></div>
  ${TH.length?`<div class="card"><div class="list">${TH.map(t=>{const o=get("members",t.other);const last=t.list[t.list.length-1];return `<div class="li clickable ${t.unread?"unread":""}" data-act="thr" data-id="${t.other}"><div class="avatar">${avIn(o)}</div><div class="grow" style="min-width:0"><div class="row between" style="flex-wrap:nowrap"><b class="t" style="display:flex;gap:6px;align-items:baseline;min-width:0"><span class="ell" style="min-width:0">${esc(o?o.name:"مستخدم")}</span><span class="small muted" style="font-weight:400;flex:none">${esc(roleLbl(o))}</span></b><span class="small muted num" style="flex:none">${msgWhen(last.at)}</span></div><div class="small muted ell">${last.fromId===m.id?"أنت: ":""}${esc(last.body)}</div></div>${t.unread?`<span class="nbadge">${t.unread}</span>`:""}</div>`}).join("")}</div></div>`:empty(C.length?"لا رسائل بعد. اضغط «رسالة جديدة» لبدء محادثة.":"لا يوجد من تراسله حالياً.")}</div>`}
function msgNewForm(to,sid){const m=me();const C=msgContacts(m);if(!C.length){toast("لا يوجد من تراسله حالياً","err");return}
  const L={teacher:"المعلم والمشرفون",admin:"الإدارة",staff:"الزملاء",student:"الطلاب",parent:"أولياء الأمور"};const G={};
  C.forEach(c=>{const k=c.x.role==="student"?"student":c.x.role==="parent"?"parent":c.why;(G[k]=G[k]||[]).push(c)});
  const opts=Object.keys(L).filter(k=>G[k]).map(k=>`<optgroup label="${L[k]}">${G[k].sort((a,b)=>a.x.name.localeCompare(b.x.name,"ar")).map(c=>`<option value="${c.x.id}" ${c.x.id===to?"selected":""}>${esc(c.x.name)}${c.x.role==="parent"&&c.sids.size?" (ولي أمر "+esc([...c.sids].map(id=>firstName(nameOf(id))).join("، "))+")":k!=="student"?" · "+esc(ROLE[c.x.role]||""):""}</option>`).join("")}</optgroup>`).join("");
  const kids=m.role==="parent"?parentKids(m):[];
  const body=`${fld("إلى",`<select name="to" id="f-to" required>${opts}</select>`)}${kids.length>1?fld("بخصوص",sel("studentId",kids.map(k=>[k.id,k.name]),sid||kids[0].id)):""}${fld("الرسالة",`<textarea name="body" id="f-body" required maxlength="2000" placeholder="اكتب رسالتك…"></textarea>`)}`;
  openModal("رسالة جديدة",body,"msgNew",{},"إرسال")}
function sendMsg(to,body,sid){const m=me();body=String(body||"").trim();if(!body||!to)return false;const x=get("members",to);
  let stu=sid||null;if(!stu){if(m.role==="student")stu=m.id;else if(x&&x.role==="student")stu=x.id;else if(m.role==="parent"){const k=parentKids(m);stu=(k.find(s=>s.teacherId===to)||k[0]||{}).id||null}else if(x&&x.role==="parent"&&isStaff(m)){const mine=new Set(myStudents(m).map(s=>s.id));stu=(x.childIds||[]).find(id=>mine.has(id))||null}}
  put("messages","msg"+gen(),{fromId:m.id,toId:to,studentId:stu,body,at:new Date().toISOString()});return true}

/* ============ ملفي ============ */
function profileView(m){const circ=m.role==="student"?get("circles",m.circleId):null;const st=isStaff(m);
  const login=typeof USEREMAIL!=="undefined"&&USEREMAIL?(typeof USERDOM==="function"&&USEREMAIL.endsWith("@"+USERDOM())?USEREMAIL.split("@")[0]:USEREMAIL):"";
  return `<div class="app-stack"><div class="card me-card"><div class="avatar" style="width:60px;height:60px;font-size:1.2rem">${avIn(m)}</div><div style="min-width:0"><h2>${esc(m.name)}</h2><div class="small muted">${ROLE[m.role]||""}${m.role==="student"?" · "+(TRACK[m.track]||""):""}${circ?" · "+esc(circ.name):""}</div>${login?`<div class="small muted" dir="ltr" style="text-align:right">${esc(login)}</div>`:""}<div class="photo-row">${photoCtl(m)}</div></div></div>
  <div class="card"><div class="card-h"><h2>بياناتي</h2></div><form class="stack" data-form="profile"><div class="fg">${fld("الاسم",inp("name",m.name,"text","required"))}${fld("الجوال",inp("phone",m.phone,"tel"))}</div>${st?fld("رابط الاجتماع الثابت (Google Meet أو Zoom)",inp("meetLink",m.meetLink,"url","placeholder='https://meet.google.com/abc-defg-hij'")):""}<div><button class="btn pri">حفظ التعديلات</button></div></form></div>
  <div class="card"><div class="row between"><b>المظهر</b><div class="seg modeseg">${[["system","تلقائي"],["light","فاتح"],["dark","ليلي"]].map(([k,l])=>`<button data-act="themeSet" data-v="${k}" class="${getThemeMode()===k?"on":""}">${l}</button>`).join("")}</div></div></div>
  <div class="card stack"><div class="row between"><b>قارئ التلاوة</b><select id="rc-sel" data-change="rcSel" style="max-width:240px">${RECITERS.map(([k,l])=>`<option value="${k}" ${plRc()===k?"selected":""}>${l}</option>`).join("")}</select></div><span class="hint">يُستخدم عند الضغط على «استمع» في المهام والمصحف.</span></div>
  ${notifSupported()?`<div class="card stack"><div class="row between"><b>${ICON.bell} الإشعارات</b>${notifOn()?`<button class="btn sm" data-act="notifOff">إيقاف</button>`:`<button class="btn sm pri" data-act="notifOn">تفعيل الإشعارات</button>`}</div><span class="hint">${notifOn()?"مفعّلة على هذا الجهاز.":"تنبيه بالرسائل الجديدة، وتذكير الورد اليومي، ومواعيد التسميع."} تصل ما دامت المنصة مفتوحة ولو في الخلفية.</span>${notifOn()?nPrefsHTML(m):""}</div>`:""}
  <div class="menu"><button class="mrow" data-act="myNav"><span class="ti">${ICON.gear}</span><b>ترتيب قائمتي</b><span class="chev">‹</span></button>${A.changePass?`<button class="mrow" data-act="changePass"><span class="ti">${NAVICON.perms||ICON.gear}</span><b>تغيير كلمة المرور</b><span class="chev">‹</span></button>`:""}${MODE==="demo"?`<button class="mrow" data-act="exitDemo"><span class="ti" style="color:var(--bad)">${NAVICON.more}</span><b style="color:var(--bad)">الخروج من التجربة</b><span class="chev">‹</span></button>`:A.logout?`<button class="mrow" data-act="logout"><span class="ti" style="color:var(--bad)">${NAVICON.logout}</span><b style="color:var(--bad)">تسجيل الخروج</b><span class="chev">‹</span></button>`:""}</div></div>`}
function postRender(){try{const m=["loading","nodb","auth"].includes(MODE)?null:me();const n=m&&m.status==="active"?unreadCount(m):0;
  if(n)document.querySelectorAll('[data-act="go"][data-v="inbox"]').forEach(b=>{const s=document.createElement("span");s.className="nbadge";s.textContent=n>99?"99+":n;b.appendChild(s)});
  const ch=document.getElementById("chat");if(ch)ch.scrollTop=ch.scrollHeight;notifTick(m);fitMushaf();fitQcf();if(!ui.freeEdit)feSweep(true)}catch(e){}
  try{if(document.getElementById("rd-host"))rMountEmbed();else if(RD.embedOn&&!RD.full){RD.embedOn=false;RD.on=false;const o=document.getElementById("mreader");if(o)o.remove()}}catch(e){console.error(e)}}
Object.assign(NAVICON,{marks:SV('<path d="M4 4h12l4 4v12H4z"/><path d="M8 10h8M8 14h5"/><circle cx="17" cy="17" r="3" fill="currentColor" stroke="none"/>'),inbox:SV('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),profile:SV('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),logout:SV('<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 16l-4-4 4-4M6 12h10"/>')});
Object.assign(A,{
  word:el=>{const k=el.dataset.k;const x=ui.marks[k];if(!x){ui.marks[k]={t:"t",c:null,h:null};ui.mpick=k}else if(MT(x.t)==="t"){x.t="l";ui.mpick=k}else{delete ui.marks[k];if(ui.mpick===k)ui.mpick=null}ui.mlast=ui.marks[k]?k:null;render()},
  mpOpen:()=>{if(ui.mlast&&ui.marks[ui.mlast]){ui.mpick=ui.mlast;render()}},
  mType:el=>{ui.mtype=el.dataset.v;render()},
  mpType:el=>{const x=ui.marks[ui.mpick];if(x){x.t=el.dataset.v;render()}},
  mpClus:el=>{const x=ui.marks[ui.mpick];if(!x)return;const c=+el.dataset.c;if(x.c===c){x.c=null;x.h=null}else{x.c=c;x.h=null}render()},
  mpHar:el=>{const x=ui.marks[ui.mpick];if(!x)return;const h=+el.dataset.h;x.h=x.h===h?null:h;render()},
  mpDel:()=>{delete ui.marks[ui.mpick];ui.mpick=null;render()},
  mpDone:()=>{ui.mpick=null;render()},
  pday:el=>{ui.pday=el.dataset.v;render()},
  pdayN:el=>{ui.pday=addDays(ui.pday||today(),+el.dataset.n);render()},
  thr:el=>{ui.thr=el.dataset.id;render()},
  thrBack:()=>{ui.thr=null;render()},
  msgNew:()=>msgNewForm(),
  msgTo:el=>{const id=el.dataset.id;if(!id||!msgContacts(me()).some(c=>c.x.id===id)){msgNewForm(id,el.dataset.sid);return}ui.thr=id;go("inbox")},
  pwEye:el=>{const i=el.parentElement.querySelector("input");if(!i)return;const show=i.type==="password";i.type=show?"text":"password";el.setAttribute("aria-label",show?"إخفاء كلمة المرور":"إظهار كلمة المرور");el.classList.toggle("on",show)},
});
Object.assign(FORMS,{
  msgNew:fd=>{if(!sendMsg(fd.get("to"),fd.get("body"),fd.get("studentId"))){toast("اكتب الرسالة","err");throw new Error("اختر")}ui.thr=fd.get("to");go("inbox");toast("أُرسلت الرسالة")},
  msg:fd=>{if(!sendMsg(ui.thr,fd.get("body"),fd.get("studentId")))throw new Error("اختر")},
});
Object.assign(ICON,{eye:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`});


/* ============ ملاحظات التسميع (تنبيه وتلقين) ============ */
const MT=t=>t==="l"?"l":"t";
const curMType=()=>MK[ui.mtype]?ui.mtype:"t";
function markInfo(x){let word=x.word,sn=x.sn,a=x.a;
  if((!word||!sn)&&Q&&Q.v[x.g]!=null){word=word||(wtext(x.g,x.w));const[si,aa]=sa(x.g);sn=sn||Q.s[si][0];a=a||aa}
  return{...x,word,sn,a,t:MT(x.t)}}
function markWordHTML(x){if(!x.word)return `<span class="muted">…</span>`;const cl=CLUS(x.word);return x.c!=null&&cl[x.c]?cl.map((y,i)=>i===x.c?`<span class="mc">${y}</span>`:y).join(""):x.word}
function markLetter(x){if(x.c==null||!x.word)return"";const cl=CLUS(x.word);const ch=cl[x.c]?[...cl[x.c]]:null;if(!ch)return"";const hm=x.h!=null?ch[x.h+1]:null;return `على حرف «${ch[0]}»${hm&&HARAKA[hm]?" · الحركة: "+HARAKA[hm]:""}`}
function markCard(x,badge){const i=markInfo(x);const lt=markLetter(i);
  return `<div class="mcard mk-${i.t} clickable" data-act="markGo" data-g="${i.g}" title="افتح في المصحف"><div class="mcard-h"><span class="pill ${MK[i.t][2]}">${MK[i.t][0]}</span>${badge||""}</div><div class="mcard-w" lang="ar">${markWordHTML(i)}</div><div class="mcard-r small">${i.sn?`سورة ${esc(i.sn)} · الآية ${i.a}`:""}</div>${lt?`<div class="mcard-l small">${esc(lt)}</div>`:""}</div>`}
function marksBlock(L,title){if(!L||!L.length)return"";if(!Q)loadQuran();
  const c={t:0,l:0};L.forEach(x=>c[MT(x.t)]++);
  return `<div class="nsec nsec-marks"><div class="nsec-h"><b>${title||"مواضع التسميع"}</b><span class="row" style="gap:6px">${c.t?`<span class="pill p-yel">تنبيه ${c.t}</span>`:""}${c.l?`<span class="pill p-bad">تلقين ${c.l}</span>`:""}</span></div><div class="mgrid">${L.map(x=>markCard(x)).join("")}</div></div>`}
const cleanTN=t=>String(t||"").replace(/\s*\|?\s*مواضع التسميع — [^|]*/g,"").trim();
function logNotesHTML(l,who){const secs=[];
  if(who==="staff"){[[nS(l),"ملاحظة للطالب"],[nP(l),"ملاحظة لولي الأمر"],[can(me(),"notes.private")?l.noteStaff:"","ملاحظة داخلية"]].forEach(([t,lb])=>{if(t)secs.push(`<div class="nsec"><div class="nsec-h"><b>${lb}</b></div><p>${esc(t)}</p></div>`)})}
  else{const n=who==="parent"?nP(l):nS(l);if(n)secs.push(`<div class="nsec nsec-msg"><div class="nsec-h"><b>${who==="parent"?"ملاحظة المعلم":"ملاحظة معلمك"}</b></div><p>${esc(n)}</p></div>`)}
  if((l.tajweed||[]).length)secs.push(`<div class="nsec"><div class="nsec-h"><b>أحكام تحتاج تدريباً</b></div><div class="chips-ro">${l.tajweed.map(x=>`<span class="pill p-warn">${esc(x)}</span>`).join("")}</div></div>`);
  const tn=cleanTN(l.tajweedNote);if(tn)secs.push(`<div class="nsec"><div class="nsec-h"><b>ملاحظات التجويد</b></div><p>${esc(tn)}</p></div>`);
  const mb=marksBlock(l.marks);if(mb)secs.push(mb);
  return secs.length?`<div class="nsecs">${secs.join("")}</div>`:""}
function marksView(m,sid,embed){sid=sid||m.id;if(m&&m.role==="parent"&&!(m.childIds||[]).includes(sid))sid=(m.childIds||[])[0];if(!Q)loadQuran();const f=ui.mkf||"all";
  const L=logsOf(sid).filter(l=>(l.marks||[]).length).sort((a,b)=>a.date<b.date?1:-1);
  const all=[];L.forEach(l=>l.marks.forEach(x=>all.push({...x,date:l.date})));
  const c={t:0,l:0};all.forEach(x=>c[MT(x.t)]++);
  const rep={};all.forEach(x=>{const k=x.g+":"+x.w;(rep[k]=rep[k]||[]).push(x)});const R=Object.values(rep).filter(a=>a.length>1).sort((a,b)=>b.length-a.length).slice(0,8);
  const show=x=>f==="all"||MT(x.t)===f;const who=m.role==="parent"?"ابنك":embed?"الطالب":"";
  const body=all.length?`<div class="mk-sum"><div class="mk-tile mk-t"><b class="num">${c.t}</b><span>تنبيه</span></div><div class="mk-tile mk-l"><b class="num">${c.l}</b><span>تلقين</span></div><div class="mk-tile"><b class="num">${L.length}</b><span>جلسة تسميع</span></div></div>
  <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="heatGo" data-id="${sid}">عرضها على المصحف</button><div class="seg modeseg">${[["all","الكل"],["t","التنبيهات"],["l","التلقين"]].map(([k,lb])=>`<button data-act="mkf" data-v="${k}" class="${f===k?"on":""}">${lb}</button>`).join("")}</div></div>
  ${R.length?`<section class="card mk-rep"><div class="card-h"><h2>تكررت أكثر من مرة</h2><span class="small muted">${who?"":"ركّز عليها في مراجعتك"}</span></div><div class="mgrid">${R.map(a=>markCard(a[0],`<span class="pill p-bad">${a.length===2?"مرتان":a.length+" مرات"}</span>`)).join("")}</div></section>`:""}
  ${L.map(l=>{const M=l.marks.filter(show);if(!M.length)return"";return `<section class="card"><div class="card-h"><h2>${fmtD(l.date,{weekday:"long",day:"numeric",month:"long"})}</h2><span class="small muted">${amountTxt(l)}</span></div><div class="mgrid">${M.map(x=>markCard(x)).join("")}</div></section>`}).join("")}`
  :empty(`لا توجد ملاحظات تسميع بعد. عندما يعلّم المعلم مواضع التنبيه أو التلقين في المصحف تظهر هنا مرتبة.`);
  if(embed)return `<div class="stack" style="gap:12px">${body}</div>`;
  return `<div class="app-stack"><div class="hero"><div><h1>ملاحظات التسميع</h1><div class="date">${m.role==="parent"?"مواضع التنبيه والتلقين في تسميع "+esc(firstName(nameOf(sid))):"مواضع التنبيه والتلقين التي سجّلها معلمك، راجعها قبل التسميع القادم"}</div></div></div>${body}</div>`}
Object.assign(A,{
  mkf:el=>{ui.mkf=el.dataset.v;render()},
  markGo:el=>{const g=+el.dataset.g;if(Q)ui.mpage=pageOf(g);go("mushaf")},
  showMarks:el=>{const l=get("logs",el.dataset.id);if(!l)return;openModal(`مواضع التسميع · ${esc(nameOf(l.studentId))} · ${fmtShort(l.date)}`,marksBlock(l.marks)||empty("لا مواضع"),"noop",{},"إغلاق")},
});
FORMS.noop=()=>{};


/* ============ صور الأعضاء ============ */
const okPhoto=u=>typeof u==="string"&&/^(https:\/\/|data:image\/|blob:)/.test(u);
const avIn=o=>o&&okPhoto(o.photo)?`<img src="${esc(o.photo)}" alt="" loading="lazy">`:esc(initials(o?o.name:"؟"));
async function shrinkImg(file,max){max=max||320;const url=URL.createObjectURL(file);try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
  const side=Math.min(img.naturalWidth||img.width,img.naturalHeight||img.height);const sz=Math.min(max,side);const c=document.createElement("canvas");c.width=sz;c.height=sz;
  c.getContext("2d").drawImage(img,((img.naturalWidth||img.width)-side)/2,((img.naturalHeight||img.height)-side)/2,side,side,0,0,sz,sz);return await new Promise(r=>c.toBlob(r,"image/jpeg",.85))}finally{URL.revokeObjectURL(url)}}
const photoCtl=x=>`<label class="btn sm">${ICON.cam} ${x.photo?"تغيير الصورة":"إضافة صورة"}<input type="file" accept="image/*" data-change="photoUp" data-id="${x.id}" hidden></label>${x.photo?`<button type="button" class="btn sm ghost danger" data-act="photoDel" data-id="${x.id}">إزالة الصورة</button>`:""}`;

/* ============ التسجيل داخل المنصة ============ */
const REC={};
const recTime=()=>{const s=Math.floor((Date.now()-(REC.t0||Date.now()))/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`};
function recUI(){if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder))return"";
  if(REC.mr&&REC.mr.state==="recording")return `<div class="rec on"><span class="rec-dot" aria-hidden="true"></span><b class="num" id="rec-t">${recTime()}</b><span class="small muted grow">جاري التسجيل…</span><button type="button" class="btn sm danger" data-act="recStop">إيقاف</button></div>`;
  if(REC.url)return `<div class="rec done"><audio controls src="${REC.url}"></audio><button type="button" class="btn sm ghost" data-act="recDiscard">حذف وإعادة التسجيل</button></div>`;
  return `<div class="rec"><button type="button" class="btn pri" data-act="recStart">${ICON.mic} سجّل الآن</button><span class="hint">أو اختر ملفاً صوتياً من جهازك بالأسفل</span></div>`}

/* ============ الاستماع للتلاوة ============ */
const RECITERS=[["Husary_128kbps","محمود خليل الحصري"],["Husary_Muallim_128kbps","الحصري (المصحف المعلّم)"],["Minshawy_Murattal_128kbps","محمد صديق المنشاوي"],["Alafasy_128kbps","مشاري العفاسي"]];
const PL={q:[],i:0,rep:1,r:0,label:"",on:false,paused:false};
function plRc(){try{const v=localStorage.getItem("halaqa-rc");return RECITERS.some(r=>r[0]===v)?v:RECITERS[0][0]}catch(e){return RECITERS[0][0]}}
const ayUrl=(s,a)=>`https://everyayah.com/data/${plRc()}/${String(s).padStart(3,"0")}${String(a).padStart(3,"0")}.mp3`;
function plAudio(){let a=document.getElementById("qplayer");if(!a){a=document.createElement("audio");a.id="qplayer";a.preload="auto";document.body.appendChild(a);a.addEventListener("ended",plNext);a.addEventListener("error",()=>{if(!PL.on)return;toast("تعذّر تشغيل التلاوة. تحقق من الاتصال.","err");plStop()})}return a}
function plPlay(list,label){if(!list.length)return;PL.q=list;PL.i=0;PL.r=0;PL.label=label;PL.on=true;plLoad()}
function plLoad(){const it=PL.q[PL.i];if(!it){plStop();return}const a=plAudio();a.src=ayUrl(it[0],it[1]);const p=a.play();if(p&&p.catch)p.catch(()=>{});PL.paused=false;plBar()}
function plNext(){if(!PL.on)return;PL.r++;if(PL.r<PL.rep){plLoad();return}PL.r=0;PL.i++;if(PL.i>=PL.q.length){if(PL.lp>1&&(PL.li=(PL.li||0)+1)<PL.lp){PL.i=0;plLoad();return}plStop();toast("انتهت التلاوة");return}plLoad()}
function plStop(){PL.on=false;const a=document.getElementById("qplayer");if(a){a.pause();a.removeAttribute("src");try{a.load()}catch(e){}}plBar()}
function plBar(){let b=document.getElementById("qbar");if(!PL.on){if(b)b.remove();document.body.classList.remove("has-qbar");return}
  if(!b){b=document.createElement("div");b.id="qbar";b.className="qbar";b.setAttribute("role","region");b.setAttribute("aria-label","مشغل التلاوة");document.body.appendChild(b)}document.body.classList.add("has-qbar");const it=PL.q[PL.i]||[];
  b.innerHTML=`<span class="qb-ic">${ICON.play}</span><div class="qb-t"><b>${esc(PL.label)}</b><span class="small">سورة ${SN(it[0])} · الآية ${it[1]} <span class="muted">(${PL.i+1} من ${PL.q.length})</span></span></div><div class="qb-c"><button class="btn sm" data-act="plRep" title="تكرار كل آية">تكرار ×${PL.rep}</button><button class="btn sm pri" data-act="plPause">${PL.paused?"تشغيل":"إيقاف مؤقت"}</button><button class="btn sm ghost" data-act="plStop" aria-label="إغلاق المشغل">✕</button></div>`}
function ayRange(s,f,t){const out=[];s=n0(s);f=n0(f)||1;t=n0(t)||f;if(!SURAHS[s-1])return out;t=Math.min(t,SURAHS[s-1].a);for(let a=Math.min(f,t);a<=Math.max(f,t);a++)out.push([s,a]);return out}
const listenBtn=t=>t&&t.surah&&n0(t.fromA)?`<button type="button" class="btn sm listen" data-act="plTask" data-s="${t.surah}" data-f="${t.fromA}" data-t="${n0(t.toA)||t.fromA}">${ICON.play} استمع</button>`:"";

/* ============ ملخص الأسبوع ============ */
function weekSummary(s){const t=today(),f=addDays(t,-6);const x=stats(s.id,f,t);const L=logsOf(s.id,f,t);return{f,t,x,pages:s.track==="tilawa"?x.tPages:x.newPages,notes:L.filter(l=>nP(l)).map(l=>[l.date,nP(l)])}}
function weekCard(s){const w=weekSummary(s),x=w.x;const att=x.att.present+x.att.late,cnt=att+x.att.absent;
  return `<section class="card week-card"><div class="card-h"><h2>ملخص الأسبوع</h2><span class="small muted num">${fmtShort(w.f)} ← ${fmtShort(w.t)}</span></div>
  <div class="wk-grid"><div><b class="num">${cnt?att+"/"+cnt:"—"}</b><span>أيام الحضور</span></div><div><b class="num">${x.tasks?x.done+"/"+x.tasks:"—"}</b><span>المهام المنجزة</span></div><div><b class="num">${w.pages}</b><span>${s.track==="tilawa"?"أوجه مقروءة":"أوجه محفوظة"}</span></div><div><b class="num">${x.errT+x.errL}</b><span>تنبيه ${x.errT} · تلقين ${x.errL}</span></div></div>
  ${w.notes.length?`<div class="nsecs">${w.notes.map(([d,n])=>`<div class="nsec nsec-msg"><div class="nsec-h"><b>ملاحظة المعلم</b><span class="small muted">${fmtShort(d)}</span></div><p>${esc(n)}</p></div>`).join("")}</div>`:""}<div class="wk-act"><button class="btn sm" data-act="wkShare" data-id="${s.id}">مشاركة الملخص</button><button class="btn sm" data-act="wkImg" data-id="${s.id}">حفظ كصورة</button></div></section>`}
function weekText(s){const w=weekSummary(s),x=w.x;const att=x.att.present+x.att.late,cnt=att+x.att.absent;return `ملخص أسبوع ${s.name} (${fmtShort(w.f)} إلى ${fmtShort(w.t)})\n• الحضور: ${cnt?att+" من "+cnt+" أيام":"لم يُسجَّل"}\n• المهام المنجزة: ${x.done} من ${x.tasks}\n• ${s.track==="tilawa"?"التلاوة":"الحفظ"}: ${w.pages} وجه\n• التنبيهات: ${x.errT} · التلقين: ${x.errL}${w.notes.length?"\nملاحظات المعلم:\n"+w.notes.map(([d,n])=>"- "+n).join("\n"):""}`}

/* ============ الإشعارات ============ */
const NOTIF={seen:null,timers:{}};
const notifSupported=()=>"Notification" in window;
function notifOn(){try{return notifSupported()&&Notification.permission==="granted"&&localStorage.getItem("halaqa-notif")==="1"}catch(e){return false}}
async function notifEnable(){if(!notifSupported()){toast("متصفحك لا يدعم الإشعارات","err");return}const p=await Notification.requestPermission();if(p==="granted"){try{localStorage.setItem("halaqa-notif","1")}catch(e){}pushSubscribe();toast("فُعّلت الإشعارات");notify(cfg().circleName,"ستصلك هنا الرسائل الجديدة وتذكير الورد ومواعيد التسميع","hello")}else toast("لم يُسمح بالإشعارات. فعّلها من إعدادات المتصفح.","err");render()}
function notify(title,body,tag){if(!notifOn())return;try{const n=new Notification(title,{body,tag,icon:"icon-192.png",lang:"ar",dir:"rtl"});n.onclick=()=>{window.focus();n.close()}}catch(e){}}
function notifTick(m){if(!m||m.status!=="active"||MODE==="demo")return;
  const unread=msgsOf().filter(x=>x.toId===m.id&&!x.readAt);
  try{if(navigator.setAppBadge){if(unread.length)navigator.setAppBadge(unread.length);else navigator.clearAppBadge()}}catch(e){}
  if(!notifOn())return;const ids=new Set(unread.map(x=>x.id));
  if(NOTIF.seen===null)NOTIF.seen=ids;else{unread.filter(x=>!NOTIF.seen.has(x.id)).forEach(x=>notify("رسالة من "+nameOf(x.fromId),String(x.body||"").slice(0,140),"msg-"+x.id));NOTIF.seen=ids}
  {const F=notifFeed(m).filter(x=>x.k!=="msg"&&x.k!=="task");if(!NOTIF.fseen)NOTIF.fseen=new Set(F.map(x=>x.id));else F.filter(x=>!NOTIF.fseen.has(x.id)).forEach(x=>{NOTIF.fseen.add(x.id);notify(x.t,x.b,x.id)})}
  const now=Date.now();const mine=s=>isStaff(m)?s.teacherId===m.id:sessStu(s).some(id=>id===m.id||(m.childIds||[]).includes(id));
  S.sessions.filter(s=>s.status==="confirmed"&&mine(s)).forEach(s=>{const st=new Date(s.start).getTime(),k="s-"+s.id;if(st-now>0&&st-now<6*36e5&&!NOTIF.timers[k])NOTIF.timers[k]=setTimeout(()=>notify("موعد التسميع بعد 10 دقائق",fmtT(s.start)+(s.note?" · "+s.note:""),k),Math.max(0,st-now-6e5))});
  if(m.role==="student"){const k="wird-"+today();if(!NOTIF.timers[k]){const at=new Date();{const _w=String(nPref(m).wd||"20:00").split(":");at.setHours(+_w[0]||20,+_w[1]||0,0,0)};const ms=at.getTime()-now;if(ms>0)NOTIF.timers[k]=setTimeout(()=>{const T=tasksOf(m.id,today(),today()).filter(t=>!t.done);if(T.length)notify("تذكير بوردك اليومي"+(streak(m.id)?` · لا تقطع سلسلة ${streak(m.id)} أيام`:""),`باقي ${T.length} من مهام اليوم: ${T.map(t=>t.title).join("، ").slice(0,120)}`,k)},ms)}}}

/* ============ تحدي الحلقة ============ */
const CHK={pages:["أوجه (حفظ وتلاوة)","وجه"],tasks:["مهام منجزة","مهمة"],att:["أيام حضور","يوم حضور"]};
const CHC={};
function chStudents(cid){return allStudents().filter(s=>cid==="all"||s.circleId===cid)}
function chValue(ch,cid,m){
  if(MODE==="live"&&!isStaff(m)&&typeof SB!=="undefined"&&SB){const k=[cid,ch.kind,ch.from,ch.to].join("|");const c=CHC[k];const fresh=c&&c.v!=null&&Date.now()-c.at<120000;
    if(!fresh&&!(c&&c.loading)){CHC[k]={...(c||{}),loading:true};SB.rpc("challenge_progress",{p_circle:cid,p_kind:ch.kind,p_from:ch.from,p_to:ch.to}).then(({data,error})=>{const r=!error&&data&&data[0];CHC[k]={at:Date.now(),v:r?+r.total:0,n:r?r.members:0};render()})}
    return c&&c.v!=null?{v:c.v,n:c.n}:null}
  const ids=chStudents(cid).map(s=>s.id);let v=0;
  if(ch.kind==="tasks")v=S.tasks.filter(t=>ids.includes(t.studentId)&&t.done&&t.date>=ch.from&&t.date<=ch.to).length;
  else{const L=S.logs.filter(l=>ids.includes(l.studentId)&&l.date>=ch.from&&l.date<=ch.to);v=ch.kind==="att"?L.filter(l=>l.attendance==="present"||l.attendance==="late").length:Math.round(L.reduce((a,l)=>a+n0(l.tPages)+n0(l.newPages),0)*10)/10}
  return{v,n:ids.length}}
function chCard(ch,cid,label,m){if(!ch||!ch.title||!ch.to||today()>addDays(ch.to,3))return"";const r=chValue(ch,cid,m);const tg=n0(ch.target)||1;const p=r?Math.min(100,Math.round(r.v/tg*100)):0;const left=Math.max(0,Math.round((new Date(ch.to)-new Date(today()))/864e5));
  return `<section class="card ch-card"><div class="card-h"><h2>${esc(ch.title)}</h2><span class="pill p-acc">${esc(label)}</span></div>
  ${ch.desc?`<p class="small muted" style="margin:0 0 8px">${esc(ch.desc)}</p>`:""}
  <div class="ch-bar"><i style="width:${p}%"></i><span class="num">${p}%</span></div>
  <div class="row between small" style="margin-top:6px"><span>${r?`<b class="num">${r.v}</b> من <b class="num">${tg}</b> ${CHK[ch.kind||"pages"][1]}`:"جاري التحميل…"}</span><span class="muted">${p>=100?"اكتمل التحدي، ما شاء الله!":today()>ch.to?"انتهت المدة":`باقي ${left} يوماً`}${r&&r.n?` · ${r.n} طالباً`:""}</span></div></section>`}
function challengeForm(cid){const isAll=cid==="all";const cur=(isAll?cfg().challenge:(get("circles",cid)||{}).challenge)||{from:today(),to:addDays(today(),30),kind:"pages",target:604};
  const body=`${fld("عنوان التحدي",inp("title",cur.title,"text","required placeholder='مثال: ختمة جماعية في شهر'"))}${fld("وصف قصير (اختياري)",inp("desc",cur.desc))}
  <div class="fg">${fld("نوع الهدف",sel("kind",Object.entries(CHK).map(([k,[l]])=>[k,l]),cur.kind||"pages"))}${fld("الهدف",inp("target",cur.target,"number","required min=1"),"مثال: 604 وجه = ختمة كاملة")}${fld("من",inp("from",cur.from,"date","required"))}${fld("إلى",inp("to",cur.to,"date","required"))}</div>
  <p class="hint">يُحسب تلقائياً من سجلات ${isAll?"كل طلاب البرنامج":"طلاب الحلقة"} في هذه المدة، ويظهر لهم في الصفحة الرئيسية.</p>`;
  openModal(isAll?"تحدي البرنامج":"تحدي الحلقة",body,"challenge",{cid},"حفظ التحدي",cur.title?`<button type="button" class="btn danger" data-act="chDel" data-cid="${cid}">إنهاء التحدي</button>`:"")}

/* ============ البرامج المصاحبة: لقاءات ورسائل ============ */
const LKIND={lesson:"درس",meeting:"لقاء",message:"رسالة تحفيزية"};
function progExtrasFor(s){const P=visProgs(s);const now=Date.now();const meets=[],msgs=[];
  P.forEach(p=>(p.lessons||[]).forEach(l=>{if(l.kind==="meeting"&&l.at){const t=new Date(l.at).getTime();if(t>now-2*36e5&&t<now+7*864e5)meets.push({p,l,t})}if(l.kind==="message"&&l.date===today())msgs.push({p,l})}));
  meets.sort((a,b)=>a.t-b.t);return{meets,msgs}}
function progExtrasHTML(s){const{meets,msgs}=progExtrasFor(s);if(!meets.length&&!msgs.length)return"";
  return `${msgs.map(({p,l})=>`<div class="msg-card motiv"><span class="small muted">${esc(p.title)}</span><b>${esc(l.title)}</b>${l.body?`<p>${esc(l.body)}</p>`:""}</div>`).join("")}
  ${meets.length?`<section class="card"><div class="card-h"><h2>لقاءات البرامج القادمة</h2></div><div class="list">${meets.map(({p,l})=>`<div class="li"><span class="ti ti-teal">${NAVICON.programs}</span><div class="grow"><b>${esc(l.title)}</b><div class="small muted">${esc(p.title)} · ${fmtDT(l.at)}</div></div>${l.meetLink?`<a class="btn sm meet" href="${esc(l.meetLink)}" target="_blank" rel="noopener">${platName(l.meetLink)}</a>`:""}</div>`).join("")}</div></section>`:""}`}
function lessonAttForm(pid,lid){const p=get("programs",pid);const l=(p.lessons||[]).find(x=>x.id===lid);if(!l)return;const m=me();
  const st=allStudents().filter(s=>p.audience==="all"||(p.audience==="selected"?(p.studentIds||[]).includes(s.id):p.audience===s.track)).filter(s=>inScope(m,s));const A_=l.att||{};
  openModal(`تحضير: ${esc(l.title)}`,st.length?`<div class="chips">${st.map(s=>`<label><input type="checkbox" name="att" value="${s.id}" ${A_[s.id]?"checked":""}>${esc(s.name)}</label>`).join("")}</div>`:empty("لا طلاب في هذا البرنامج."),"lessonAtt",{pid,lid},"حفظ التحضير")}

/* ============ استيراد الطلاب من Excel ============ */
let IMP=null;
const IMP_COLS=[["name",["الاسم","اسم الطالب","الاسم الكامل"]],["track",["المسار"]],["circle",["الحلقة"]],["teacher",["المعلم"]],["phone",["الجوال","جوال الطالب","رقم الجوال"]],["guardianPhone",["جوال ولي الأمر","ولي الأمر"]],["level",["المرحلة","المرحلة الدراسية"]]];
function impForm(){IMP=null;openModal("استيراد الطلاب من Excel",`<p class="small">جهّز ملف Excel أعمدته: <b>الاسم</b> (إلزامي)، المسار (حفظ أو تلاوة)، الحلقة، المعلم، الجوال، جوال ولي الأمر، المرحلة. اسم الحلقة والمعلم يُطابَق مع الموجود في المنصة.</p>
  <div class="row"><button type="button" class="btn sm" data-act="impTpl">${ICON.dl||""} تنزيل نموذج جاهز</button><label class="btn sm pri">اختيار ملف Excel<input type="file" accept=".xlsx,.xls,.csv" data-change="impFile" hidden></label></div><div id="imp-prev"></div>`,"impStudents",{},"استيراد")}
function impPreviewHTML(){if(!IMP)return"";const ok=IMP.filter(r=>!r.skip);
  return `<p class="small" style="margin-top:10px"><b>${ok.length}</b> طالب جاهز للاستيراد${IMP.length-ok.length?` · ${IMP.length-ok.length} صف سيُتجاوز`:""}</p><div class="tbl-wrap" style="max-height:300px"><table><thead><tr><th>الاسم</th><th>المسار</th><th>الحلقة</th><th>المعلم</th><th>الحالة</th></tr></thead><tbody>${IMP.map(r=>`<tr><td>${esc(r.name||"—")}</td><td>${TRACK[r.track]||"—"}</td><td>${esc(r.circleName||"—")}</td><td>${esc(r.teacherName||"—")}</td><td>${r.skip?`<span class="pill p-warn">${esc(r.skip)}</span>`:`<span class="pill p-ok">جاهز</span>`}</td></tr>`).join("")}</tbody></table></div>`}

Object.assign(CH,{
  photoUp:async el=>{const f=el.files&&el.files[0];const id=el.dataset.id;el.value="";if(!f||!id)return;if(!/^image\//.test(f.type)){toast("اختر صورة","err");return}
    try{toast("جاري حفظ الصورة…");const blob=await shrinkImg(f);let url;
      if(MODE==="live"&&ASSETS){const r=await ASSETS.upload(new File([blob],"photo.jpg",{type:"image/jpeg"}));url=r.url}
      else url=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob)});
      patch("members",id,{photo:url});toast("حُفظت الصورة")}catch(e){toast("تعذّر حفظ الصورة","err")}},
  rcSel:el=>{try{localStorage.setItem("halaqa-rc",el.value)}catch(e){}toast("اختير القارئ: "+(RECITERS.find(r=>r[0]===el.value)||[,""])[1])},
  impFile:async el=>{const f=el.files&&el.files[0];if(!f)return;let X;try{X=await lib(XLSX_SRC,"XLSX")}catch(e){toast("تعذّر تحميل أداة Excel","err");return}
    try{const wb=/\.csv$/i.test(f.name)?X.read(await f.text(),{type:"string"}):X.read(await f.arrayBuffer(),{type:"array"});const ws=wb.Sheets[wb.SheetNames[0]];const rows=X.utils.sheet_to_json(ws,{header:1,defval:""});
      const hi=rows.findIndex(r=>r.some(c=>IMP_COLS[0][1].includes(String(c).trim())));if(hi<0){toast("لم أجد عمود «الاسم» في الملف","err");return}
      const H=rows[hi].map(c=>String(c).trim());const col=k=>{const names=IMP_COLS.find(x=>x[0]===k)[1];return H.findIndex(h=>names.includes(h))};
      const C={};IMP_COLS.forEach(([k])=>C[k]=col(k));const names=new Set(allStudents().map(s=>s.name.trim()));const seen=new Set();
      IMP=rows.slice(hi+1).map(r=>{const g=k=>C[k]>=0?String(r[C[k]]??"").trim():"";const name=g("name");if(!name)return null;
        const tr=/تلاو/.test(g("track"))?"tilawa":"hifz";const cn=g("circle"),tn=g("teacher");const circ=cn?S.circles.find(c=>c.name.trim()===cn):null;const tch=tn?teachers().find(t=>t.name.trim()===tn||firstName(t.name)===firstName(tn)):null;
        const o={name,track:tr,circleId:circ?circ.id:"",circleName:cn,teacherId:tch?tch.id:circ?circ.teacherId:me().id,teacherName:tn||(circ?nameOf(circ.teacherId):""),phone:g("phone"),guardianPhone:g("guardianPhone"),level:g("level")};
        if(names.has(name))o.skip="موجود مسبقاً";else if(seen.has(name))o.skip="مكرر في الملف";else if(cn&&!circ)o.circleId="";seen.add(name);return o}).filter(Boolean);
      const box=document.getElementById("imp-prev");if(box)box.innerHTML=impPreviewHTML();if(!IMP.length)toast("الملف لا يحتوي أسماء","err")}catch(e){console.error(e);toast("تعذّرت قراءة الملف","err")}},
});
Object.assign(A,{
  photoDel:el=>{patch("members",el.dataset.id,{photo:""});toast("أُزيلت الصورة")},
  recStart:async()=>{try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const mt=["audio/webm;codecs=opus","audio/mp4","audio/webm","audio/ogg"].find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))||"";
    const mr=new MediaRecorder(st,mt?{mimeType:mt}:undefined);REC.chunks=[];mr.ondataavailable=e=>{if(e.data&&e.data.size)REC.chunks.push(e.data)};
    mr.onstop=()=>{st.getTracks().forEach(t=>t.stop());clearInterval(REC.tm);REC.blob=new Blob(REC.chunks,{type:mr.mimeType||"audio/webm"});REC.url=URL.createObjectURL(REC.blob);render()};
    REC.mr=mr;REC.t0=Date.now();mr.start(1000);REC.tm=setInterval(()=>{const e=document.getElementById("rec-t");if(e)e.textContent=recTime();if(Date.now()-REC.t0>20*60000)A.recStop()},500);render()}catch(e){toast("لم يُسمح باستخدام الميكروفون. فعّله من إعدادات المتصفح ثم أعد المحاولة.","err")}},
  recStop:()=>{if(REC.mr&&REC.mr.state==="recording")REC.mr.stop()},
  recDiscard:()=>{if(REC.mr&&REC.mr.state==="recording"){REC.mr.onstop=null;REC.mr.stop()}clearInterval(REC.tm);if(REC.url)URL.revokeObjectURL(REC.url);Object.keys(REC).forEach(k=>delete REC[k]);render()},
  plTask:el=>plPlay(ayRange(el.dataset.s,el.dataset.f,el.dataset.t),`سورة ${SN(+el.dataset.s)}`),
  plPage:()=>{if(!Q)return;const pg=ui.mpage||1;const f=Q.p[pg-1],t=(pg<604?Q.p[pg]:Q.v.length)-1;const L=[];for(let g=f;g<=t;g++){const[si,a]=sa(g);L.push([si+1,a])}plPlay(L,`الصفحة ${pg}`)},
  plRep:()=>{PL.rep=PL.rep===1?3:PL.rep===3?5:1;PL.r=0;plBar()},
  plPause:()=>{const a=plAudio();if(PL.paused){a.play().catch(()=>{});PL.paused=false}else{a.pause();PL.paused=true}plBar()},
  plStop:()=>plStop(),
  weekSend:el=>{if(!el.dataset.ok){el.dataset.ok=1;el.textContent="اضغط مرة أخرى للإرسال";return}const m=me();let n=0;
    myStudents(m).forEach(s=>S.members.filter(p=>p.role==="parent"&&p.status==="active"&&(p.childIds||[]).includes(s.id)).forEach(p=>{if(sendMsg(p.id,weekText(s),s.id))n++}));
    toast(n?`أُرسل ملخص الأسبوع إلى ${n} من أولياء الأمور في «الرسائل»`:"لا يوجد أولياء أمور مرتبطون بطلابك","")},
  notifOn:()=>notifEnable(),
  nToggle:()=>{const m=me();ui.npanel=!ui.npanel;if(ui.npanel&&m)nStore(m,"open",notifFeed(m).map(x=>x.id).slice(0,400));render()},
  nGo:el=>{const m=me();if(m){const R=nRead(m);R.add(el.dataset.id);nStore(m,"read",[...R].slice(-400))}ui.npanel=false;const v=el.dataset.v,id=el.dataset.x;
    if(v==="student"&&id){ui.sid=id;ui.stab=el.dataset.tab||ui.stab;go("student")}else if(v==="program"&&id){ui.pid=id;go("program")}else if(v==="report"&&id){ui.rsid=id;go("report")}else go(v||"home")},
  nAllRead:()=>{const m=me();if(!m)return;const ids=notifFeed(m).map(x=>x.id);nStore(m,"read",[...new Set([...nRead(m),...ids])].slice(-400));nStore(m,"open",ids.slice(0,400));render()},
  schMode:el=>{ui.sch=el.dataset.v;render()},
  trF:el=>{ui.trf=el.dataset.v;render()},
  trRestore:el=>trashRestore(el.dataset.k),
  tplSave:el=>{const f=el.closest("form");const nm=(f.querySelector("#tpl-name").value||"").trim();if(!nm){toast("اكتب اسم القالب","err");return}const p=planFromForm(f);if(!p.gFromS||!(p.amt>0)){toast("أكمل الاتجاه والنطاق والورد أولاً","err");return}
    const s=get("members",modalCtx.sid);const dur=p.startDate&&p.endDate?Math.round((new Date(p.endDate)-new Date(p.startDate))/864e5):0;const t={id:"tp"+gen(),name:nm,track:s?s.track:"",dir:p.dir,gFromS:p.gFromS,gFromA:p.gFromA,gToS:p.gToS,gToA:p.gToA,amt:p.amt,amtN:p.amtN,amtU:p.amtU,unit:"line",days:p.days,dur,goal:(f.querySelector('[name="goal"]').value||"").trim(),rev:p.rev&&p.rev.on?p.rev:null};
    put("config","plantpl",{items:[...tplList().filter(x=>x.name!==nm),t]});el.closest("details").open=false;toast("حُفظ القالب «"+nm+"»")},
  tplDel:el=>{put("config","plantpl",{items:tplList().filter(x=>x.id!==el.dataset.id)});toast("حُذف القالب");if($("#bp-tpls"))bulkPlanForm(modalCtx.cid)},
  bulkPlan:el=>bulkPlanForm(el.dataset.cid||""),
  reschedOpen:el=>reschedForm(get("members",el.dataset.id)),
  heatGo:el=>{const sid=el.dataset.id;ui.mheat=sid;ui.tasmee=false;const H=heatMap(sid);const top=heatPages(H)[0];if(top)ui.mpage=top[0];go("mushaf")},
  mPageGo:el=>{ui.mpage=+el.dataset.v;render();window.scrollTo({top:0,behavior:"smooth"})},
  heatOff:()=>{ui.mheat=null;render()},
  tnNew:()=>tenantForm(),
  tnEdit:el=>tenantForm(TN.list.find(t=>t.id===el.dataset.id)),
  tnToggle:el=>{const t=TN.list.find(x=>x.id===el.dataset.id);if(!t)return;const st=t.data.status==="suspended"?"active":"suspended";openModal(st==="suspended"?"إيقاف اشتراك":"تفعيل اشتراك",`<p>${st==="suspended"?"ستُقفل منصة":"ستُفتح منصة"} «${esc(t.data.name)}» لكل مستخدميها${st==="suspended"?" ويظهر لهم أن الاشتراك موقوف":""}.</p><p class="hint">يُطبَّق خلال دقائق عند فتحهم المنصة.</p>`,"tnStatus",{id:t.id,st},st==="suspended"?"تأكيد الإيقاف":"تأكيد التفعيل")},
  tnLink:el=>{const t=TN.list.find(x=>x.id===el.dataset.id);if(!t)return;const d=t.data;const cfgT=progConfigText(d);const ok=d.slug&&d.sbUrl&&d.sbKey;
    openModal("تشغيل برنامج «"+d.name+"»",`<ol class="prog-steps">
      <li><b>قاعدة بيانات مستقلة:</b> من حسابك في <a href="https://supabase.com/dashboard" target="_blank" rel="noopener">Supabase</a> أنشئ مشروعاً جديداً باسم البرنامج، ثم من <b>SQL Editor</b> شغّل <a href="${SCHEMA_URL}" target="_blank" rel="noopener">ملف قاعدة البيانات (schema.sql)</a> كاملاً.</li>
      <li><b>اربطه هنا:</b> من <b>Project Settings ← API</b> انسخ الرابط والمفتاح العام، وضعهما في «تعديل ← الإعدادات التقنية». ${ok?`<span class="pill p-ok">تم ✓</span>`:`<span class="pill p-warn">ناقص</span>`}</li>
      <li><b>ملف الإعداد:</b> نزّل الملف وارفعه في المستودع داخل المجلد <code dir="ltr">maeen-quran/programs/${esc(d.slug||"slug")}/</code> — ومعه شعار البرنامج باسم <code dir="ltr">icon-192.png</code> و<code dir="ltr">icon-512.png</code> إن رغبت.</li>
      <li><b>الدخول الأول:</b> افتح <a href="${esc(d.url||"#")}" target="_blank" rel="noopener" dir="ltr">${esc(d.url||"رابط البرنامج")}</a> بعد دقيقتين، وأول من يسجّل يصير مدير البرنامج، ثم يخصّص الاسم والشعار والألوان من «الإدارة».</li>
      <li><b>(اختياري)</b> لإنشاء حسابات الطلاب بدون إيميل: انشر دالة <code dir="ltr">create-account</code> في مشروع البرنامج.</li></ol>
      <pre class="codebox" dir="ltr">${esc(cfgT)}</pre>
      <div class="row"><button type="button" class="btn sm pri" data-act="tnDl" data-id="${t.id}" data-f="config">تنزيل config.js</button><button type="button" class="btn sm" data-act="tnDl" data-id="${t.id}" data-f="manifest">تنزيل manifest.webmanifest</button><button type="button" class="btn sm" data-act="tnCopy" data-v="${esc(cfgT)}">نسخ</button></div>
      <p class="hint">كل برنامج له قاعدة بيانات منفصلة تماماً، ولا يصل لوحتك منه إلا حالة اشتراكه وأعداد مستخدميه.</p>`,"noop",{},"إغلاق")},
  tnDl:el=>{const t=TN.list.find(x=>x.id===el.dataset.id);if(!t)return;if(el.dataset.f==="manifest")progDownload("manifest.webmanifest",progManifestText(t.data),"application/manifest+json");else progDownload("config.js",progConfigText(t.data),"text/javascript")},
  tnCopy:el=>{try{navigator.clipboard.writeText(el.dataset.v);toast("نُسخ")}catch(e){}},
  nAll:()=>{ui.npanel=false;go("notifs")},
  nFilter:el=>{ui.nf=el.dataset.v;render()},
  notifOff:()=>{try{localStorage.removeItem("halaqa-notif")}catch(e){}pushUnsubscribe();toast("أُوقفت الإشعارات");render()},
  newChallenge:el=>challengeForm(el.dataset.cid||"all"),
  chDel:el=>{const cid=el.dataset.cid;if(cid==="all"){const c={...(get("config","main")||{})};delete c.challenge;put("config","main",c)}else patch("circles",cid,{challenge:null});closeModal();toast("أُنهي التحدي")},
  lessonAtt:el=>lessonAttForm(el.dataset.pid,el.dataset.id),
  examFromGoal:el=>{const s=get("members",el.dataset.id);if(!s)return;const g=goalInfo(s);examForm({date:today(),scope:g.range||(s.plan||{}).goal||""},s.id)},
  impOpen:()=>impForm(),
  impTpl:()=>exportXLSX("نموذج-استيراد-الطلاب",[{name:"الطلاب",title:"",sub:"",head:["الاسم","المسار","الحلقة","المعلم","الجوال","جوال ولي الأمر","المرحلة"],rows:[["عبدالله محمد السالم","حفظ",(S.circles[0]||{}).name||"حلقة الفرقان",nameOf((S.circles[0]||{}).teacherId)||"",'0500000000','0550000000',"المتوسطة"]]}]),
});
Object.assign(FORMS,{
  challenge:fd=>{const cid=modalCtx.cid;const ch={title:fd.get("title").trim(),desc:fd.get("desc"),kind:fd.get("kind"),target:n0(fd.get("target")),from:fd.get("from"),to:fd.get("to")};if(ch.to<ch.from){toast("تاريخ النهاية قبل البداية","err");throw new Error("اختر")}
    if(cid==="all")put("config","main",{...(get("config","main")||{}),challenge:ch});else patch("circles",cid,{challenge:ch});toast("حُفظ التحدي، ويظهر للطلاب في صفحتهم")},
  lessonAtt:fd=>{const p=get("programs",modalCtx.pid);const L=(p.lessons||[]).map(l=>l.id===modalCtx.lid?{...l,att:Object.fromEntries(fd.getAll("att").map(id=>[id,true]))}:l);patch("programs",p.id,{lessons:L});toast("حُفظ التحضير")},
  impStudents:fd=>{if(!IMP||!IMP.length){toast("اختر ملف Excel أولاً","err");throw new Error("اختر")}const ok=IMP.filter(r=>!r.skip);if(!ok.length){toast("لا يوجد طلاب جدد في الملف","err");throw new Error("اختر")}
    ok.forEach(r=>put("members","m"+gen(),{name:r.name,role:"student",status:"active",track:r.track,circleId:r.circleId,teacherId:r.teacherId,phone:r.phone,guardianPhone:r.guardianPhone,level:r.level,joined:today()}));toast(`أُضيف ${ok.length} طالب`);IMP=null},
});
Object.assign(ACT_PERM,{weekSend:"daily.log",newChallenge:"circles.manage",chDel:"circles.manage",lessonAtt:"programs.manage",examFromGoal:"exams.manage",impOpen:"students.edit",impTpl:"students.edit"});
Object.assign(ICON,{mic:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`,play:`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5v14l12-7z"/></svg>`,cam:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>`,bell:`<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`});



/* ============ المصحف بتخطيط مصحف المدينة (15 سطراً) ============ */
let MQ=null,MQLOAD=null;
function loadMushaf(){if(MQ||MQLOAD)return;MQLOAD=fetch("mushaf.json").then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{
  const n=d.w.length;d.wa=new Int32Array(n);d.last=new Uint8Array(n);for(let g=0;g<d.a.length;g++){const a=d.a[g],b=g+1<d.a.length?d.a[g+1]:n;for(let i=a;i<b;i++)d.wa[i]=g;d.last[b-1]=1}
  d.sset=new Map(d.s.map((w,i)=>[w,i]));MQ=d;render()}).catch(()=>{MQLOAD="err"})}
const wtext=(g,w)=>MQ&&MQ.a[g]!=null?(MQ.w[MQ.a[g]+w]||""):(Q&&Q.v[g]?(Q.v[g].split(" ")[w]||""):"");
function mqPageHTML(pg,tm){const M=MQ,W=M.w,L=M.l;const p0=M.p[pg-1],p1=pg<604?M.p[pg]:W.length;
  let lo=0,hi=L.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(L[mid]<p0)lo=mid+1;else hi=mid}
  let html="";for(let li=lo;li<L.length&&L[li]<p1;li++){const a=L[li],b=li+1<L.length?Math.min(L[li+1],p1):p1;
    if(M.sset.has(a)){const si=M.sset.get(a);html+=`<div class="sura-h"><span>سورة ${esc(M.n[si])}</span></div>`;if(M.bs[si]&&si!==0)html+=`<div class="basm">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>`}
    let it="";for(let wi=a;wi<b;wi++){const g=M.wa[wi],w=wi-M.a[g];
      if(M.b[wi])it+=`<span class="mk-div">${M.b[wi]}</span>`;
      it+=tm?wordHTML(g,w,W[wi]):heatSpan(g+":"+w,W[wi]);
      if(M.last[wi]){const[,an]=sa(g);it+=`<span class="an">۝${AR_D(an)}</span>`}}
    html+=`<div class="ml">${it}</div>`}
  return html}
function fitMushaf(el0){const el=el0&&el0.nodeType?el0:document.querySelector(".mushaf.m15");if(!el)return;const base=32;el.style.fontSize=base+"px";el.style.setProperty("--mlw","100%");
  const cs=getComputedStyle(el);const cw=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);const open=el.classList.contains("m-open");
  const nat=()=>{let mx=0;const f=parseFloat(el.style.fontSize);el.querySelectorAll(".ml").forEach(l=>{let s=0;for(const c of l.children)s+=c.getBoundingClientRect().width;s+=(l.children.length-1)*f*.12;if(s>mx)mx=s});return mx};
  if(open){const fs=Math.min(cw*.06,33);el.style.fontSize=fs.toFixed(2)+"px";const mx=nat();el.style.setProperty("--mlw",Math.min(cw,Math.ceil(mx*1.04))+"px");return}
  const mx=nat();if(mx>0)el.style.fontSize=Math.min(base*cw/mx,42).toFixed(2)+"px";
  for(let i=0;i<5;i++){let r=1;el.querySelectorAll(".ml").forEach(l=>{if(l.clientWidth<40)return;const q=l.scrollWidth/l.clientWidth;if(q>r)r=q});if(r<=1.002)break;el.style.fontSize=Math.max(10,parseFloat(el.style.fontSize)/(r*1.01)).toFixed(2)+"px"}
  {const f2=parseFloat(el.style.fontSize);el.querySelectorAll(".ml").forEach(l=>{l.classList.remove("mfull");if(l.clientWidth<40)return;let w=0;for(const c of l.children)w+=c.getBoundingClientRect().width;if(w>l.clientWidth*.72&&l.children.length>2)l.classList.add("mfull")})}}
window.addEventListener("resize",()=>{clearTimeout(window.__fm);window.__fm=setTimeout(()=>{fitMushaf();fitQcf()},120)});
try{document.fonts&&document.fonts.ready.then(()=>fitMushaf());document.fonts&&document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",()=>{fitMushaf();try{fitQcf()}catch(e){}})}catch(e){}

/* ============ المصحف بخطوط مجمع الملك فهد QCF4 (مطابق للمطبوع سطراً وكلمة) ============ */
const QCF_CDN="https://cdn.jsdelivr.net/npm/quran-qcf4@1.1.0/";
const QCFP={},QCFF={};let QCF_OFF=false,QCF_FAIL=0;
function qcfFontLoad(name){if(QCFF[name])return QCFF[name];const file=name==="QCF4_QBSML"?name:name+"_W";
  QCFF[name]=new FontFace(name,`url(${QCF_CDN}fonts-woff2/${file}.woff2) format("woff2")`,{display:"block"}).load().then(f=>{document.fonts.add(f);return f});return QCFF[name]}
function qcfLoad(pg){if(QCF_OFF||typeof FontFace==="undefined")return null;if(QCFP[pg])return QCFP[pg];QCFP[pg]={loading:true};
  fetch(`${QCF_CDN}pages/${String(pg).padStart(3,"0")}.json`).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(async d=>{
    await Promise.all([...new Set(d.lines.flatMap(l=>l.words.map(w=>w.font)))].map(qcfFontLoad));QCFP[pg]=d;if(ui.view==="mushaf"&&ui.mpage===pg)render()})
  .catch(()=>{delete QCFP[pg];if(++QCF_FAIL>=4)QCF_OFF=true;if(ui.view==="mushaf")render()});return QCFP[pg]}
function qcfPageHTML(d,tm){let h="";
  d.lines.forEach(l=>{const W=l.words||[];if(!W.length){h+=`<div class="ql qc">&nbsp;</div>`;return}const t=W[0].type;
    if(t==="surah_header"){h+=`<div class="sura-h qh"><span style="font-family:'${W[0].font}'">${W[0].char}</span></div>`;return}
    if(t==="bismillah"){h+=`<div class="ql qc qb">${W.map(w=>`<span style="font-family:'${w.font}'">${w.char}</span>`).join("")}</div>`;return}
    h+=`<div class="ql">${W.map(w=>{const ff=`font-family:'${w.font}'`;
      if(w.type==="word"&&tm&&w.verse_key){const[s,a]=w.verse_key.split(":").map(Number);const g=Q.ss[s-1]+a-1,k=g+":"+(w.position-1);const mk=ui.marks[k];
        return `<span class="w ${mk?MK[MT(mk.t)][1]:""} ${ui.mpick===k?"wsel":""}" style="${ff}" data-act="word" data-k="${k}" role="button" tabindex="0">${w.char}</span>`}
      if(w.type==="word"&&HEATM&&w.verse_key){const[s,a]=w.verse_key.split(":").map(Number);const hs=heatSpan(gOf(s,a)+":"+(w.position-1),w.char,ff);if(hs)return hs}
      return `<span class="${w.type==="end"?"qe":w.type==="quarter"?"qq":""}" style="${ff}">${w.char}</span>`}).join("")}</div>`});
  return h}
function fitQcf(el0){const el=el0&&el0.nodeType?el0:document.querySelector(".mushaf.mqcf");if(!el)return;
  const cs=getComputedStyle(el);const cw=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);if(cw<=0)return;
  /* حجم واحد لكل الصفحات: أعرض سطر في المصحف كله = 17.44em (ص577) */
  let fs=Math.min(cw/16.35,38);el.style.fontSize=fs.toFixed(2)+"px";const L=[...el.querySelectorAll(".ql")];let mx=0;L.forEach(l=>{let w=0;for(const c of l.children)w+=c.getBoundingClientRect().width;if(w>mx)mx=w});if(mx>cw*1.005||(mx>0&&mx<cw*.95)){fs=Math.min(fs*cw/mx*.98,46);el.style.fontSize=fs.toFixed(2)+"px"}
  L.forEach(l=>l.classList.add("qshort"))}
function ring(done,total,size){size=size||76;const r=size/2-7,C=2*Math.PI*r,p=total?done/total:0;
  return `<div class="ring" style="width:${size}px;height:${size}px" role="img" aria-label="أنجزت ${done} من ${total}"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="7"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${p===1?"var(--ok)":"var(--primary)"}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg><div class="ring-t"><b>${done}/${total}</b></div></div>`}
function taskTap(t,ro){
  return `<div class="tap-task ${t.done?"done":""} ${ro?"ro":""}" ${ro?"":`data-act="toggleTask" data-id="${t.id}" role="button" tabindex="0" aria-pressed="${t.done}"`}><span class="cb ${t.done?"on":""}" aria-hidden="true">${t.done?ICON.check:""}</span><div class="tt"><div class="row" style="gap:6px">${kindTag(t.kind)}<b class="t">${esc(taskTitle(t))}</b></div>${t.surah?`<div class="small rng row" style="gap:8px">${esc(taskRng(t))}${listenBtn(t)}</div>`:""}${t.details?`<div class="small muted" style="white-space:pre-wrap">${esc(t.details)}</div>`:""}${t.programId&&get("programs",t.programId)?`<div class="small" style="color:var(--accent)">${esc(get("programs",t.programId).title)}</div>`:""}${t.link||t.fileUrl?`<div class="row" style="margin-top:4px">${t.link?`<a class="btn sm" href="${esc(t.link)}" target="_blank" rel="noopener">فتح الرابط ↗</a>`:""}${t.fileUrl?`<a class="btn sm" href="${esc(t.fileUrl)}" target="_blank" rel="noopener">📎 ${esc(t.fileName||"المرفق")}</a>`:""}</div>`:""}</div></div>`;
}
function celebrate(msg){
  const el=document.createElement("div");el.className="celebrate";el.innerHTML=`<div class="cel-box">${Array.from({length:14},(_,i)=>`<i style="--a:${i*26}deg;--d:${(i%4)*60}ms"></i>`).join("")}<b>${esc(msg)}</b></div>`;
  document.body.appendChild(el);setTimeout(()=>el.remove(),2600);
}
function foldHTML(title,count,inner,open){return `<details class="fold" ${open?"open":""}><summary><span>${title}</span>${count!=null?`<span class="pill">${count}</span>`:""}</summary><div class="fold-b">${inner}</div></details>`}
function logsCards(s,L,who){
  const c=cfg();const showG=c.studentSeeGrades;const showN=who==="parent"?c.parentSeeNotes:c.studentSeeNotes;const isT=s.track==="tilawa";
  if(!L.length)return empty("لا يوجد سجل متابعة في هذه الفترة.");
  return `<div class="lcards">${L.map(l=>{const n=who==="parent"?nP(l):nS(l);return `<div class="lcard"><div class="row between"><b class="num">${fmtD(l.date,{weekday:"long",day:"numeric",month:"long"})}</b><span class="pill ${ATT_CLS[l.attendance]||""}">${ATT[l.attendance]||"—"}</span></div>
   ${amountTxt(l)!=="—"?`<div class="small">${amountTxt(l)}</div>`:""}
   ${showG?`<div class="row" style="gap:6px">${isT?`${n0(l.tGrade)?`<span class="pill ${gradeCls(l.tGrade)}">الأداء: ${gradeTxt(l.tGrade)}</span>`:""}${errShort(l)!=="—"?`<span class="pill">${errShort(l)}</span>`:""}`:`${n0(l.newGrade)?`<span class="pill ${gradeCls(l.newGrade)}">الحفظ: ${gradeTxt(l.newGrade)}</span>`:""}${n0(l.revGrade)?`<span class="pill ${gradeCls(l.revGrade)}">المراجعة: ${gradeTxt(l.revGrade)}</span>`:""}${errShort(l)!=="—"?`<span class="pill">${errShort(l)}</span>`:""}`}</div>`:""}
   ${showN?logNotesHTML(l,who):showG?(marksBlock(l.marks)?`<div class="nsecs">${marksBlock(l.marks)}</div>`:""):""}</div>`}).join("")}</div>`;
}
function studentToday(m){
  const d=today();const T=tasksOf(m.id,d,d);const late=tasksOf(m.id,addDays(d,-3),addDays(d,-1)).filter(t=>!t.done);
  const up=tasksOf(m.id,addDays(d,1),addDays(d,3)).sort((a,b)=>a.date<b.date?-1:1);
  const next=S.sessions.filter(s=>sessStu(s).includes(m.id)&&s.status==="confirmed"&&new Date(s.start).getTime()+n0(s.duration||30)*60000>Date.now()).sort((a,b)=>a.start<b.start?-1:1)[0];
  const c=cfg();const mr=monthRange(d.slice(0,7));const x=stats(m.id,mr[0],mr[1]);const lastLog=logsOf(m.id)[0];const circ=get("circles",m.circleId);
  const doneN=T.filter(t=>t.done).length;const sessToday=next&&next.start.slice(0,10)===new Date().toISOString().slice(0,10)||next&&ymd(new Date(next.start))===d;
  const primary=sessToday&&next.link?`<a class="btn meet big" href="${esc(next.link)}" target="_blank" rel="noopener">${ICON.video} دخول التسميع · ${fmtT(next.start)}</a>`:circ&&circ.meetLink?`<a class="btn meet big" href="${esc(circ.meetLink)}" target="_blank" rel="noopener">${ICON.video} دخول الحلقة</a>`:"";
  const jz=Object.values(m.hifzMap||{}).filter(v=>v==="m"||v==="x").length;
  const B={};try{B.zadpray=`<div class="zhw">${zHomeHTML()}</div>`}catch(e){}try{B.selfwird=selfWirdCard(m)}catch(e){}
  B.hero=`<section class="today-card pattern"><div class="tc-top"><div style="min-width:0">${brand().verse?`<div class="verse">${esc(brand().verse)}</div>`:""}<h1>السلام عليكم، ${esc(firstName(m.name))}</h1><div class="date">${fmtD(d)}</div><div class="small muted">${doneN===T.length&&T.length?"أنجزت مهام اليوم، بارك الله فيك":T.length?`باقي ${T.length-doneN} من مهام اليوم`:"لا مهام اليوم"}</div></div>${ring(doneN,T.length)}</div>${primary?`<div class="tc-actions">${primary}</div>`:""}</section>`;
  B.stats=`<div class="chipbar">${[[streak(m.id),"أيام متتالية"],...(c.showPoints?[[x.points,"نقطة هذا الشهر"]]:[]),[totalPages(m),m.track==="tilawa"?"وجه مقروء":"وجه محفوظ"],...(jz?[[jz,"أجزاء في خريطتي"]]:[]),[x.rate==null?"—":x.rate+"%","نسبة الحضور"]].map(([v,l])=>`<div class="chipstat"><b class="num">${v}</b><span>${l}</span></div>`).join("")}</div>`;
  B.msg=m.msgStudent?`<div class="msg-card"><span class="small muted">رسالة من معلمك</span><p>${esc(m.msgStudent)}</p></div>`:"";
  B.tasks=`<section class="card"><div class="card-h"><h2>مهام اليوم</h2><span class="pill ${doneN===T.length&&T.length?"p-ok":""}">${doneN}/${T.length}</span></div><div class="stack" style="gap:8px">${T.length?T.map(taskTap).join(""):empty("لا مهام اليوم. استمر في وردك.")}</div>${late.length?foldHTML("مهام متأخرة",late.length,`<div class="stack" style="gap:8px">${late.map(taskTap).join("")}</div>`,true):""}</section>`;
  B.next=next&&!(sessToday&&next.link)?`<div class="row-card"><span class="ti ti-teal">${NAVICON.sessions}</span><div class="grow"><b>موعد التسميع القادم</b><div class="small muted">${fmtDT(next.start)}${next.note?" · "+esc(next.note):""}</div></div><div class="row">${next.link?`<a class="btn sm meet" href="${esc(next.link)}" target="_blank" rel="noopener">${platName(next.link)}</a>`:""}<a class="btn sm" href="${gcal(next)}" target="_blank" rel="noopener" aria-label="أضف للتقويم">${ICON.cal}</a></div></div>`:"";
  B.circle=circ?`<div class="row-card"><span class="ti">${NAVICON.child}</span><div class="grow"><b>${esc(circ.name)}</b><div class="small muted">${hasTime(circ)?schedTxt(circ)+" · ":""}${esc(nameOf(circ.teacherId))}</div></div><div class="row">${circ.meetLink&&!primary.includes(circ.meetLink)?`<a class="btn sm meet" href="${esc(circ.meetLink)}" target="_blank" rel="noopener">دخول</a>`:""}${hasTime(circ)?`<a class="btn sm" href="${circleCal(circ)}" target="_blank" rel="noopener" aria-label="مواعيد الحلقة في التقويم">${ICON.cal}</a>`:""}</div></div>`:"";
  const showLL=lastLog&&(c.studentSeeNotes||c.studentSeeGrades);
  B.side=(showLL?foldHTML(`آخر متابعة من معلمك <span class="small muted">· ${fmtShort(lastLog.date)}</span>`,null,logsCards(m,[lastLog],"student"),true):"")+(()=>{const h=upcomingHTML(m,7);return h?foldHTML("الأيام القادمة",null,h+`<div class="row" style="margin-top:10px;justify-content:center"><button class="btn sm" data-act="go" data-v="plan">الخطة كاملة</button></div>`,true):""})();
  B.goal=goalCard(m,true);B.board=topStrip(m,[m.id],"student");B.challenge=chCard(cfg().challenge,"all","تحدي البرنامج",m)+(circ?chCard(circ.challenge,circ.id,"تحدي "+circ.name,m):"");B.prog=progExtrasHTML(m);
  const bd=badges(m.id);B.badges=bd.length?foldHTML("أوسمتي",bd.length,`<div class="badges">${bd.map(([t,h])=>`<span class="badge"><i aria-hidden="true">✦</i><span><b>${esc(t)}</b><small>${esc(h)}</small></span></span>`).join("")}</div>`):"";
  const cn=S.certs.filter(z=>z.studentId===m.id).length;B.certs=cn?foldHTML("شهاداتي",cn,certsList(m.id,false)):"";
  homeExtras("student",m,B);return `<div class="app-stack">${homeLayout("student",B)}</div>`;
}
function kidTabs(kids){return kids.length>1?`<div class="kidtabs" role="tablist">${kids.map(k=>`<button role="tab" data-act="kid" data-id="${k.id}" class="${k.id===ui.kid?"on":""}" aria-selected="${k.id===ui.kid}"><span class="avatar">${avIn(k)}</span>${esc(firstName(k.name))}</button>`).join("")}</div>`:""}
function parentKids(m){return (m.childIds||[]).map(id=>get("members",id)).filter(Boolean)}
function parentView(m){
  const c=cfg();const kids=parentKids(m);
  if(!c.parentsEnabled)return empty("متابعة أولياء الأمور غير مفعّلة حالياً من المشرف.");
  if(!kids.length)return empty("لم يُربط حسابك بأي طالب بعد. سيربطه المشرف قريباً.");
  if(!ui.kid||!kids.some(k=>k.id===ui.kid))ui.kid=kids[0].id;
  const s=get("members",ui.kid);const d=today();const T=tasksOf(s.id,d,d);const l=get("logs",`${s.id}_${d}`);const mr=monthRange(d.slice(0,7));const x=stats(s.id,mr[0],mr[1]);
  const t=teacherOf(s);const wa=t&&waNum(t.phone);const circ=get("circles",s.circleId);const doneN=T.filter(z=>z.done).length;
  const next=S.sessions.filter(z=>sessStu(z).includes(s.id)&&z.status==="confirmed"&&new Date(z.start).getTime()>Date.now()-3600000).sort((a,b)=>a.start<b.start?-1:1)[0];
  const bd=badges(s.id),cn=S.certs.filter(z=>z.studentId===s.id).length;
  const B={};try{B.zadpray=`<div class="zhw">${zHomeHTML()}</div>`}catch(e){}B.kids=kidTabs(kids);B.hero=`<section class="today-card pattern"><div class="tc-top"><div style="min-width:0"><span class="small muted">متابعة ابنك</span><h1>${esc(s.name)}</h1><div class="small muted">${TRACK[s.track]||""}${circ?" · "+esc(circ.name):""} · ${esc(nameOf(s.teacherId))}</div></div>${ring(doneN,T.length)}</div>
   <div class="kid-sum"><div><span>اليوم</span><b class="pill ${l?ATT_CLS[l.attendance]:""}">${l?(ATT[l.attendance]||"مسجّل"):"لم يُسجَّل"}</b></div><div><span>نسبة الحضور</span><b class="num">${x.rate==null?"—":x.rate+"%"}</b></div><div><span>${s.track==="tilawa"?"المقروء":"المحفوظ"}</span><b class="num">${totalPages(s)} وجه</b></div></div>
   <div class="tc-actions">${wa?`<a class="btn meet" href="https://wa.me/${wa}" target="_blank" rel="noopener">واتساب المعلم</a>`:""}<button class="btn" data-act="msgTo" data-id="${t?t.id:""}" data-sid="${s.id}">${NAVICON.inbox.replace("<svg",'<svg width="16" height="16"')} مراسلة المعلم</button></div></section>`;B.strip=`${topStrip(m,[s.id],"parent")}`;B.prog=`${progExtrasHTML(s)}`;B.week=`${weekCard(s)}`;B.msg=`${s.msgParent?`<div class="msg-card"><span class="small muted">ملاحظة من المعلم</span><p>${esc(s.msgParent)}</p></div>`:""}`;B.goal=`${goalCard(s,false)}`;B.marks=`${logsOf(s.id).some(l=>(l.marks||[]).length)?`<button class="row-card clickable" data-act="go" data-v="marks" style="width:100%;text-align:start;font:inherit;color:inherit"><span class="ti">${NAVICON.marks}</span><div class="grow"><b>ملاحظات التسميع</b><div class="small muted">مواضع التنبيه والتلقين مرتبة</div></div><span class="chev">‹</span></button>`:""}`;B.next=`${next?`<div class="row-card"><span class="ti ti-teal">${NAVICON.sessions}</span><div class="grow"><b>موعد التسميع القادم</b><div class="small muted">${fmtDT(next.start)}</div></div><a class="btn sm" href="${gcal(next)}" target="_blank" rel="noopener" aria-label="أضف للتقويم">${ICON.cal}</a></div>`:""}`;B.tasks=`${T.length?foldHTML("مهام اليوم",`${doneN}/${T.length}`,`<div class="stack" style="gap:8px">${T.map(z=>`<div class="tap-task ${z.done?"done":""}" style="cursor:default"><span class="cb ${z.done?"on":""}">${z.done?ICON.check:""}</span><div class="tt"><div class="row" style="gap:6px">${kindTag(z.kind)}<b class="t">${esc(z.title)}</b></div></div></div>`).join("")}</div>`):""}`;B.badges=`${bd.length?foldHTML("الأوسمة",bd.length,`<div class="badges">${bd.map(([q,h])=>`<span class="badge"><i aria-hidden="true">✦</i><span><b>${esc(q)}</b><small>${esc(h)}</small></span></span>`).join("")}</div>`):""}`;B.certs=`${cn?foldHTML("الشهادات",cn,certsList(s.id,false)):""}`;B.report=`${foldHTML("التقرير التفصيلي",null,c.parentSeeReport?periodPicker()+reportInner(s.id,curRange(s.id),false,true):logsCards(s,logsOf(s.id).slice(0,20),"parent"))}`;
  Object.keys(B).forEach(k=>{if(!String(B[k]).trim())delete B[k]});
  homeExtras("parent",m,B);return `<div class="app-stack">${homeLayout("parent",B)}</div>`;
}
function parentNotes(m){
  const c=cfg();const kids=parentKids(m);if(!kids.length)return empty("لم يُربط حسابك بأي طالب بعد.");
  const items=[];kids.forEach(s=>{if(s.msgParent)items.push({pin:1,s,date:"",t:s.msgParent});if(c.parentSeeNotes)logsOf(s.id).forEach(l=>{if(nP(l))items.push({s,date:l.date,t:nP(l),att:l.attendance})});
    S.recits.filter(r=>r.studentId===s.id&&r.status==="reviewed"&&r.feedback).forEach(r=>items.push({s,date:r.date,t:"على التسميع الصوتي «"+(r.title||"")+"»: "+r.feedback}))});
  items.sort((a,b)=>(b.pin||0)-(a.pin||0)||(a.date<b.date?1:-1));
  return `<div class="app-stack"><div class="hero"><h1>ملاحظات المعلم</h1></div>${items.length?`<div class="stack" style="gap:10px">${items.slice(0,80).map(i=>`<div class="note-item ${i.pin?"pin":""}"><div class="row between"><span class="row" style="gap:6px">${kids.length>1?`<span class="pill p-pri">${esc(firstName(i.s.name))}</span>`:""}${i.pin?'<span class="pill p-acc">مثبّتة</span>':""}</span><span class="small muted">${i.date?fmtShort(i.date):""}</span></div><p>${esc(i.t)}</p></div>`).join("")}</div>`:empty("لا ملاحظات بعد.")}</div>`;
}

/* ============ التشغيل ============ */

/* ============ الربط مع Supabase ============ */
const CFG=window.APP_CONFIG||{};
const SB=(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase)?window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
const TABLES=["members","circles","config","programs","tasks","logs","progress","exams","certs","recits","notes","sessions","tatt","messages"];
const RAW={};TABLES.forEach(t=>RAW[t]=new Map());
let USERMETA={},USEREMAIL="",CHANNEL=null,ME_SIG="",RENDER_Q=false;
const BOOT={};
function errMsg(e,pre){const m=String((e&&(e.message||e.code))||"");
  if(/row-level security|not allowed|permission/i.test(m))return pre+": ليست لديك صلاحية لهذا الإجراء";
  if(/Failed to fetch|network/i.test(m))return pre+": تحقق من اتصال الإنترنت";
  return pre+(m?" ("+m.slice(0,80)+")":"")}
async function upsertRow(t,id,data){
  // السجل الموجود يُعدَّل بـ update (لأن upsert يفحص صلاحية الإضافة أيضاً فيرفض تعديلات الطالب وولي الأمر)
  if(RAW[t]&&RAW[t].has(id)){const{data:r,error}=await SB.from(t).update({data}).eq("id",id).select("id");if(error)throw error;if(!r||!r.length)throw{message:"not allowed (row-level security)"};return}
  const{error}=await SB.from(t).upsert({id,data});if(error)throw error}
async function deleteRow(t,id){const{error}=await SB.from(t).delete().eq("id",id);if(error)throw error}
async function syncNote(ref,aud,text,sid){const id=ref+"|"+aud;const cur=RAW.notes.get(id);const curT=cur&&cur.data?cur.data.text:"";
  if(String(text||"").trim()===String(curT||"").trim())return;
  if(text&&String(text).trim())await upsertRow("notes",id,{ref,audience:aud,studentId:sid,text:String(text)});
  else if(RAW.notes.has(id))await deleteRow("notes",id)}
async function remotePut(c,id,data){
  if(c==="logs"){const{noteStudent,noteParent,noteStaff,note,...rest}=data;await upsertRow("logs",id,rest);
    const sid=data.studentId;const mm=me();
    if(noteStudent!==undefined||note!==undefined)await syncNote(id,"student",noteStudent??note,sid);
    if(noteParent!==undefined||note!==undefined)await syncNote(id,"parent",noteParent??note,sid);
    if(noteStaff!==undefined&&can(mm,"notes.private"))await syncNote(id,"staff",noteStaff,sid);return}
  if(c==="members"){const{msgParent,...rest}=data;await upsertRow("members",id,rest);
    if(msgParent!==undefined&&isStaff(me())&&rest.role==="student")await syncNote("m:"+id,"parent",msgParent,id);return}
  await upsertRow(c,id,data);
}
async function remoteDel(c,id){
  await deleteRow(c,id);
  if(c==="logs")for(const a of ["student","parent","staff"]){const k=id+"|"+a;if(RAW.notes.has(k))try{await deleteRow("notes",k)}catch(e){}}
}
function rebuild(){
  const N={};RAW.notes.forEach(r=>{const d=r.data||{};(N[d.ref]=N[d.ref]||{})[d.audience]=d.text});
  COLS.forEach(c=>{const rows=RAW[c]?[...RAW[c].values()]:[];LIVE[c]=rows.map(r=>{const o={...(r.data||{}),id:r.id};
    if(c==="logs"){const n=N[r.id]||{};if(n.student!=null)o.noteStudent=n.student;if(n.parent!=null)o.noteParent=n.parent;if(n.staff!=null)o.noteStaff=n.staff}
    if(c==="members"){const n=N["m:"+r.id]||{};if(n.parent!=null)o.msgParent=n.parent}
    return o})});
  const m=LIVE.members.find(x=>x.uid===UID);const sig=m?[m.role,m.status,m.scopeOverride,m.attScopeOverride,JSON.stringify(m.circleIds||[]),JSON.stringify(m.childIds||[]),JSON.stringify(m.permOverrides||{}),m.circleId,m.teacherId].join("|"):"";
  if(ME_SIG&&sig!==ME_SIG){ME_SIG=sig;setTimeout(reloadAll,300)}else ME_SIG=sig;
}
function scheduleRender(){if(RENDER_Q)return;RENDER_Q=true;requestAnimationFrame(()=>{RENDER_Q=false;rebuild();if(S===LIVE)render();snapSaveSoon()})}
async function loadTable(t){const map=new Map();let from=0;for(;;){const{data,error}=await SB.from(t).select("id,data").range(from,from+999);if(error)throw error;data.forEach(r=>map.set(r.id,r));if(data.length<1000)break;from+=1000}RAW[t]=map}
async function reloadTable(c){if(!SB||MODE!=="live")return;try{await loadTable(c);if(c==="logs"||c==="members")await loadTable("notes");scheduleRender()}catch(e){}}
async function reloadAll(){if(!SB)return;try{await Promise.all(TABLES.map(loadTable));offApplyQueueToRaw();OFF.on=false;rebuild();snapSave();if(S===LIVE)render()}catch(e){console.error(e);if(await snapLoad()){OFF.on=true;offApplyQueueToRaw();rebuild();if(S===LIVE)render();toast("أنت غير متصل: تعرض المنصة آخر بيانات محفوظة على جهازك")}else toast(errMsg(e,"تعذّر تحميل البيانات"),"err")}}
function subscribe(){
  if(CHANNEL)SB.removeChannel(CHANNEL);
  CHANNEL=SB.channel("halaqa-db");
  TABLES.forEach(t=>CHANNEL.on("postgres_changes",{event:"*",schema:"public",table:t},pl=>{
    if(pl.eventType==="DELETE"){const id=pl.old&&pl.old.id;if(id)RAW[t].delete(id)}else if(pl.new&&pl.new.id)RAW[t].set(pl.new.id,{id:pl.new.id,data:pl.new.data});
    scheduleRender()}));
  CHANNEL.subscribe(st=>{if(st==="CHANNEL_ERROR"||st==="TIMED_OUT")SLOW=true});
}
async function startSession(sess){
  if(UID===sess.user.id&&MODE==="live")return;
  UID=sess.user.id;USERMETA=sess.user.user_metadata||{};USEREMAIL=sess.user.email||"";
  MODE="live";S=LIVE;READY.clear();render();
  const timer=setTimeout(()=>{if(READY.size<COLS.length){SLOW=true;render()}},10000);
  try{const{data,error}=await SB.rpc("has_director");OWNER=error?false:!data}catch(e){OWNER=false}
  offLoadQueue();
  ASSETS={async upload(file){
    if(file.size>20*1024*1024)throw{code:"الملف أكبر من 20 ميجابايت"};
    const ext=(String(file.name).split(".").pop()||"bin").replace(/[^a-z0-9]/gi,"").slice(0,8)||"bin";
    const path=`${UID}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}.${ext}`;
    const up=await SB.storage.from("files").upload(path,file,{contentType:file.type||"application/octet-stream",upsert:false});if(up.error)throw{code:up.error.message};
    const sg=await SB.storage.from("files").createSignedUrl(path,60*60*24*365*2);if(sg.error)throw{code:sg.error.message};
    return{id:path,url:sg.data.signedUrl}}};
  await reloadAll();subscribe();clearTimeout(timer);SLOW=false;COLS.forEach(c=>READY.add(c));licPing();
  if(notifOn())setTimeout(pushSubscribe,2000);offBar();
  const h=location.hash.slice(1);if(h&&!/access_token|type=/.test(h))ui.view=h;
  render();
}
function stopSession(){if(CHANNEL){SB.removeChannel(CHANNEL);CHANNEL=null}UID=null;ME_SIG="";TABLES.forEach(t=>{if(t!=="config")RAW[t]=new Map()});COLS.forEach(c=>LIVE[c]=[]);READY.clear()}
DL={async save({filename,data}){const blob=data instanceof Blob?data:new Blob([data]);const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}};

/* ============ حسابات الدخول التي ينشئها المعلم ============ */
function genPass(){const a="abcdefghjkmnpqrstuvwxyz23456789";let p="";const r=new Uint32Array(9);crypto.getRandomValues(r);r.forEach(v=>p+=a[v%a.length]);return p}
const USERDOM=()=>(CFG.usernameDomain||"s.maeen.com.sa").toLowerCase();
async function callAcct(body){
  if(MODE==="demo"||!SB)return{ok:true,username:body.username,demo:true};
  const{data,error}=await SB.functions.invoke("create-account",{body});
  if(error){let msg="";try{const j=await error.context.json();msg=j.error}catch(e){}throw new Error(msg||error.message||"تعذّر الاتصال بالخادم")}
  if(data&&data.error)throw new Error(data.error);return data;
}
function acctShare(s,username,password){
  const site=location.origin;const msg=`السلام عليكم\nبيانات دخول ${s.name} إلى ${cfg().circleName}:\nالرابط: ${site}\nاسم المستخدم: ${username}\nكلمة المرور: ${password}\nيمكن تغيير كلمة المرور بعد الدخول من «المزيد».`;
  const num=waNum(s.guardianPhone||s.phone);
  openModal("بيانات الدخول",`<div class="cred"><div><span>الرابط</span><b dir="ltr">${esc(site)}</b></div><div><span>اسم المستخدم</span><b dir="ltr">${esc(username)}</b></div><div><span>كلمة المرور</span><b dir="ltr">${esc(password)}</b></div></div>
   <p class="hint">احفظها أو أرسلها لولي الأمر الآن؛ لن تظهر كلمة المرور مرة أخرى. يمكنك دائماً تعيين كلمة مرور جديدة.</p>
   <textarea id="f-msg" data-input="wa" style="min-height:130px;width:100%;padding:8px;border:1px solid var(--line);border-radius:9px;background:var(--bg)">${esc(msg)}</textarea>
   <div class="row"><button type="button" class="btn" data-act="copyMsg">نسخ</button>${num?`<a id="wa-link" class="btn meet" href="https://wa.me/${num}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">إرسال لولي الأمر بواتساب</a>`:""}</div>`,"noop",{num},"تم");
}
async function createAccount(id,username,password){
  const s=get("members",id);username=String(username||"").trim().toLowerCase();
  if(!/^[a-z0-9._-]{3,30}$/.test(username)){toast("اسم المستخدم: من 3 إلى 30 حرفاً إنجليزياً أو رقماً","err");return false}
  if(String(password||"").length<8){toast("كلمة المرور 8 أحرف على الأقل","err");return false}
  try{toast("جاري إنشاء الحساب…");const r=await callAcct({action:"create",memberId:id,username,password});
    if(r.demo){local("members",id,{...s,uid:"demo-"+username,username,email:username+"@"+USERDOM(),status:"active"});render()}
    else await reloadTable("members");
    setTimeout(()=>acctShare(s,username,password),150);return true}catch(e){toast(e.message,"err");return false}
}
function acctForm(s,reset){
  openModal(reset?`كلمة مرور جديدة: ${esc(s.name)}`:`حساب دخول: ${esc(s.name)}`,`${reset?`<p class="small">اسم المستخدم: <b dir="ltr">${esc(s.username||s.email||"")}</b></p>`:fld("اسم المستخدم",inp("username","","text","required dir='ltr' autocapitalize='off' autocomplete='off' placeholder='ahmad.salem'"),"حروف إنجليزية وأرقام ونقطة فقط، ويدخل به الطالب بدل الإيميل")}
  ${fld("كلمة المرور",inp("password",genPass(),"text","required dir='ltr' minlength=8 autocomplete='off'"),"كلمة مولّدة عشوائياً، ويمكنك كتابة غيرها")}<div><button type="button" class="btn sm" data-act="regenPass">توليد كلمة أخرى</button></div>`,reset?"acctReset":"acctCreate",{id:s.id},reset?"تعيين":"إنشاء الحساب");
}
Object.assign(FORMS,{
  acctCreate:async fd=>{const ok=await createAccount(modalCtx.id,fd.get("username"),fd.get("password"));if(!ok)throw new Error("اختر")},
  acctReset:async fd=>{const id=modalCtx.id,s=get("members",id),pw=fd.get("password");
    try{await callAcct({action:"reset",memberId:id,password:pw});setTimeout(()=>acctShare(s,s.username||s.email,pw),150)}catch(e){toast(e.message,"err");throw new Error("اختر")}},
});
Object.assign(A,{
  acctCreate:el=>acctForm(get("members",el.dataset.id),false),
  acctReset:el=>acctForm(get("members",el.dataset.id),true),
  regenPass:()=>{const i=$("#f-password");if(i)i.value=genPass()},
});
Object.assign(ACT_PERM,{acctCreate:"students.edit",acctReset:"students.edit"});
CH.dzc=el=>setComp(el.dataset.c,el.dataset.p,el.dataset.num?Number(el.value):el.value);
CH.feIcUp=async el=>{if(!isDir())return;const f=el.files&&el.files[0];el.value="";if(!f)return;if(!/^image\/(svg\+xml|png|webp)/.test(f.type)){toast("اختر SVG أو PNG","err");return}
  try{let url;if(f.type==="image/svg+xml"){if(f.size>80000){toast("ملف SVG كبير، الحد 80KB","err");return}url=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)})}else url=await fitImg(f,160);
    const id="u"+Date.now().toString(36);const d=design();setDesign({icImgs:{...(d.icImgs||{}),[id]:url}});setFreeMany(()=>({ic:"img:"+id}));toast("أُضيفت الأيقونة. اضغط «حفظ التعديلات»")}catch(e){toast("تعذّر رفع الأيقونة","err")}};
CH.dzImg=async el=>{const f=el.files&&el.files[0];el.value="";if(!f)return;if(!/^image\//.test(f.type)){toast("اختر صورة","err");return}const k=el.dataset.c;
  try{let url;if(ASSETS){toast("جاري رفع الصورة…");const r=await ASSETS.upload(f);url=r.url}else if(MODE==="demo"){url=URL.createObjectURL(f)}else{url=await fitImg(f,1600);if(url.length>900000){toast("الصورة كبيرة جداً، صغّرها وجرّب","err");return}}
    setComp(k,"img",url);toast("رُفعت الصورة. اضغط «حفظ التعديلات» لتظهر للجميع")}catch(e){toast("تعذّر رفع الصورة: "+(e&&(e.code||e.message)||""),"err")}};
CH.hbSz=el=>{const g=el.dataset.g;const items=homeOrder(g);const x=items.find(y=>y.k===el.dataset.k);if(!x)return;const v=el.value;if(v){x.sz=v;delete x.hh}else delete x.sz;hbSave(g,items)};
CH.hbW=el=>{const g=el.dataset.g;const items=homeOrder(g);const x=items.find(y=>y.k===el.dataset.k);if(!x)return;x.w=Number(el.value);x.full=x.w===12;hbSave(g,items)};
Object.assign(CH,{asRoleSel:el=>{if(!isDir())return;el.value?asRole(el.value):asApply(null)},asPage:el=>{ui.view=el.value;ui.feSel=null;ui.homeEdit=null;render();scrollTo(0,0)},asSel:el=>asApply(el.value||null),feCol:el=>setFreeMany(()=>({[el.dataset.p]:el.value})),feTxt:el=>setFreeOne({txt:el.value.trim()}),});
CH.dz=el=>setDesign({[el.dataset.k]:el.dataset.num?Number(el.value):el.value});CH.dzb=el=>setDesign({[el.dataset.k]:el.checked});CH.dzCss=el=>setDesign({css:el.value});
CH.mkAcct=el=>{$("#mk-box").hidden=!el.checked;if(el.checked){const u=$("#f-username");if(u)u.focus()}};

/* ============ الدخول والتسجيل ============ */
function authView(){
  const t=ui.auth||"login";let f="";
  if(t==="login")f=`<form class="card stack" data-form="login"><h2>تسجيل الدخول</h2>${fld("الإيميل أو اسم المستخدم",inp("email","","text","required dir='ltr' autocapitalize='off' autocomplete='username'"))}${fld("كلمة المرور",pwInp("password","required autocomplete='current-password'"))}<button class="btn pri big">دخول</button><div class="row between"><button type="button" class="btn ghost sm" data-act="authTab" data-v="forgot">نسيت كلمة المرور؟</button><button type="button" class="btn ghost sm" data-act="authTab" data-v="signup">حساب جديد</button></div></form>`;
  else if(t==="signup")f=`<form class="card stack" data-form="signup"><h2>إنشاء حساب</h2>${fld("الاسم الكامل",inp("name","","text","required"))}${fld("الإيميل",inp("email","","email","required autocomplete='username'"))}${fld("رقم الجوال",inp("phone","","tel","required placeholder='05xxxxxxxx'"))}${fld("كلمة المرور",pwInp("password","required minlength=8 autocomplete='new-password'"),"8 أحرف على الأقل")}${fld("تأكيد كلمة المرور",pwInp("password2","required minlength=8 autocomplete='new-password'"))}<button class="btn pri big">إنشاء الحساب</button><p class="hint">سيصلك إيميل لتأكيد حسابك، ثم تختار صفتك (طالب، معلم، ولي أمر) وبرنامجك.</p><button type="button" class="btn ghost sm" data-act="authTab" data-v="login">لديّ حساب، تسجيل الدخول</button></form>`;
  else if(t==="forgot")f=`<form class="card stack" data-form="forgot"><h2>استعادة كلمة المرور</h2>${fld("الإيميل",inp("email","","email","required"))}<button class="btn pri big">إرسال رابط الاستعادة</button><button type="button" class="btn ghost sm" data-act="authTab" data-v="login">العودة لتسجيل الدخول</button></form>`;
  else if(t==="reset")f=`<form class="card stack" data-form="newpass"><h2>كلمة مرور جديدة</h2>${fld("كلمة المرور الجديدة",pwInp("password","required minlength=8 autocomplete='new-password'"))}${fld("تأكيدها",pwInp("password2","required minlength=8 autocomplete='new-password'"))}<button class="btn pri big">حفظ كلمة المرور</button></form>`;
  else f=`<div class="card stack"><h2>تحقق من بريدك</h2><p>أرسلنا لك رسالة على <b>${esc(ui.authEmail||"")}</b>. افتحها واضغط الرابط${ui.auth==="sent"?" لتأكيد حسابك":" لتعيين كلمة مرور جديدة"}، ثم ارجع هنا.</p><p class="hint">لم تصلك؟ افحص مجلد الرسائل غير المرغوبة.</p><button type="button" class="btn" data-act="authTab" data-v="login">تسجيل الدخول</button></div>`;
  return `<main class="wrap"><div class="center-page auth-page"><img class="welcome-logo" src="${logoFull()}" alt="${esc(cfg().circleName)}"><h1>${esc(cfg().circleName)}</h1><p class="muted">منصة متابعة حلقات القرآن الكريم: الحفظ والتلاوة، المتابعة اليومية، البرامج والتقارير.</p>${f}</div></main>`;
}
const pwInp=(name,attrs)=>`<div class="pw-wrap">${inp(name,"","password",attrs)}<button type="button" class="pw-eye" data-act="pwEye" aria-label="إظهار كلمة المرور">${ICON.eye}</button></div>`;
const AUTH_ERR=e=>{const m=String(e&&e.message||"");if(/Invalid login/i.test(m))return"الإيميل أو كلمة المرور غير صحيحة";if(/not confirmed/i.test(m))return"أكّد إيميلك أولاً من الرسالة التي وصلتك";if(/already registered|already been registered/i.test(m))return"هذا الإيميل مسجّل مسبقاً، سجّل الدخول أو استعد كلمة المرور";if(/rate|too many/i.test(m))return"محاولات كثيرة، انتظر قليلاً ثم أعد المحاولة";if(/Password/i.test(m))return"كلمة المرور ضعيفة: استخدم 8 أحرف على الأقل";return m||"حدث خطأ"};
Object.assign(FORMS,{
  login:async fd=>{let id=fd.get("email").trim().toLowerCase();if(!id.includes("@"))id=id+"@"+USERDOM();const{error}=await SB.auth.signInWithPassword({email:id,password:fd.get("password")});if(error){toast(AUTH_ERR(error),"err");return}},
  signup:async fd=>{const email=fd.get("email").trim(),pw=fd.get("password");if(pw!==fd.get("password2")){toast("كلمتا المرور غير متطابقتين","err");return}
    const{data,error}=await SB.auth.signUp({email,password:pw,options:{data:{name:fd.get("name").trim(),phone:fd.get("phone").trim()},emailRedirectTo:location.origin+location.pathname}});
    if(error){toast(AUTH_ERR(error),"err");return}if(!data.session){ui.auth="sent";ui.authEmail=email;render()}},
  forgot:async fd=>{const email=fd.get("email").trim();const{error}=await SB.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(error){toast(AUTH_ERR(error),"err");return}ui.auth="sentReset";ui.authEmail=email;render()},
  newpass:async fd=>{const pw=fd.get("password");if(pw!==fd.get("password2")){toast("كلمتا المرور غير متطابقتين","err");return}const{error}=await SB.auth.updateUser({password:pw});if(error){toast(AUTH_ERR(error),"err");return}toast("تم تغيير كلمة المرور");ui.auth="login";const{data}=await SB.auth.getSession();if(data.session)startSession(data.session);else{MODE="auth";render()}},
});
Object.assign(A,{
  authTab:el=>{ui.auth=el.dataset.v;render()},
  logout:async()=>{if(MODE==="demo"){S=LIVE;MODE=PREV}await SB.auth.signOut();stopSession();MODE="auth";ui.auth="login";ui.view=null;render()},
  changePass:()=>openModal("تغيير كلمة المرور",`${fld("كلمة المرور الجديدة",pwInp("password","required minlength=8 autocomplete='new-password'"))}${fld("تأكيدها",pwInp("password2","required minlength=8 autocomplete='new-password'"))}`,"newpass2",{},"حفظ"),
});
FORMS.newpass2=async fd=>{const pw=fd.get("password");if(pw!==fd.get("password2")){toast("كلمتا المرور غير متطابقتين","err");throw new Error("اختر")}const{error}=await SB.auth.updateUser({password:pw});if(error){toast(AUTH_ERR(error),"err");throw new Error("اختر")}toast("تم تغيير كلمة المرور")};
ACT_PERM.backup="perms.manage";
CH.importFile=async el=>{const f=el.files&&el.files[0];if(!f)return;try{const j=JSON.parse(await f.text());const cols=j.collections||{};let n=0,fail=0;const order=["config","circles","members","programs","tasks","logs","progress","exams","certs","recits","sessions","tatt"];
  toast("جاري الاستيراد…");for(const c of order){for(const d of (cols[c]||[])){const{id,...data}=d;if(!id)continue;if(c==="config"&&id==="perms"&&!isOwnerM(me())&&me().role!=="director")continue;if(c==="members"){if(data.uid===UID)continue;delete data.uid}try{await remotePut(c,id,data);n++}catch(e){fail++}}}
  await reloadAll();toast(`استُورد ${n} سجل${fail?` · تعذّر ${fail}`:""}`)}catch(e){toast("ملف غير صالح","err")}el.value=""};

/* لوحة الشرف للطلاب وأولياء الأمور: تُحسب على الخادم (أسماء ونقاط فقط) */
const LB={key:"",rows:null};
async function loadLB(f,t){const key=f+t;if(LB.key===key&&LB.rows)return;LB.key=key;LB.rows=null;const{data,error}=await SB.rpc("leaderboard",{p_from:f,p_to:t});LB.rows=error?[]:data;render()}

async function boot(){
  render();swRegister();
  if(!SB){MODE="nodb";render();return}
  SB.auth.onAuthStateChange((ev,sess)=>{
    if(ev==="PASSWORD_RECOVERY"){ui.auth="reset";MODE="auth";render();return}
    if((ev==="SIGNED_IN"||ev==="INITIAL_SESSION"||ev==="TOKEN_REFRESHED")&&sess&&ui.auth!=="reset"){if(MODE!=="demo")startSession(sess);return}
    if(ev==="SIGNED_OUT"){stopSession();if(MODE!=="demo"){MODE="auth";ui.auth="login";render()}}});
  const{data}=await SB.auth.getSession();
  if(!data.session&&MODE==="loading"){MODE="auth";ui.auth=ui.auth||"login";render();
    try{await loadTable("config");rebuild();if(MODE==="auth")render()}catch(e){}}
}

/* ============ إضافات الواجهة: وردي اليوم، خريطة الأخطاء، السلسلة، المجموعات، القوالب، وضع الحفظ، التذكيرات، التقرير الأسبوعي ============ */
(function(){const H=HOME_BLOCKS;const ins=(g,after,row)=>{if(H[g].some(x=>x[0]===row[0]))return;const i=H[g].findIndex(x=>x[0]===after);H[g].splice(i<0?H[g].length:i+1,0,row)};
  ins("student","hero",["wird","وردي اليوم",1]);ins("student","stats",["streak","سلسلة الإنجاز",1]);ins("student","board",["errmap","خريطة أخطائي",1]);
  ins("parent","hero",["streak","سلسلة الابن",1]);ins("parent","marks",["errmap","خريطة أخطاء الابن",1]);ins("parent","report",["wird","وردي اليوم",1,1]);
  ins("staff","zadpray",["wird","وردي اليوم",1,1])})();
const XW={cel:null};
/* --- وردي اليوم (من الختمة في المصحف أو آخر صفحة) --- */
function wirdCard(){try{rdPull()}catch(e){}if(!Q){try{loadQuran()}catch(e){}}
  const K=zls.get("rk:"+rU(),null);const last=+zls.get("rlast",0)||0;const sn=p=>{try{return Q?esc(Q.s[sa(Q.p[p-1])[0]][0]):""}catch(e){return""}};
  if(K){let R=[];try{R=khRows(K)}catch(e){}if(R.length){const t0=today();let idx=R.findIndex(r=>r.date===t0);if(idx<0)idx=t0>R[R.length-1].date?R.length-1:0;const fo=R.findIndex(r=>!K.done[r.i]);const cur=R[fo>=0?fo:idx];const late=R.filter(r=>r.date<t0&&!K.done[r.i]).length;const dn=R.filter(r=>K.done[r.i]).length;const pct=Math.round(dn/R.length*100);const ok=!!K.done[cur.i];
    return `<section class="card wd-card"><div class="card-h"><h2>وردي اليوم</h2><span class="pill ${ok?"p-ok":late?"p-warn":"p-acc"}">${ok?"مكتمل ✓":late?`متأخر ${late}`:"على الموعد"}</span></div>
    <div class="wd-body"><div class="wd-pg"><b class="num">${cur.from===cur.to?cur.from:cur.from+"–"+cur.to}</b><span>${cur.from===cur.to?"صفحة":"الصفحات"}</span></div><div class="wd-t"><b>${sn(cur.from)||"الورد "+cur.i}</b><small class="muted">الورد ${cur.i} من ${R.length}</small><div class="wd-bar"><i style="width:${pct}%"></i></div><small class="muted wd-pc">أنجزت ${pct}% من الختمة</small></div></div>
    <div class="wd-act"><button class="btn pri sm" data-act="wdOpen" data-p="${cur.from}">افتح الورد</button><button class="btn sm ${ok?"on":""}" data-act="wdDone" data-v="${cur.i}">${ok?"✓ تم":"تم"}</button></div></section>`}}
  return `<section class="card wd-card"><div class="card-h"><h2>وردي اليوم</h2></div>
    <div class="wd-body"><div class="wd-pg"><b class="num">${last||1}</b><span>${last?"آخر صفحة":"البداية"}</span></div><div class="wd-t"><b>${last?sn(last)||"تابع من حيث وقفت":"ابدأ قراءتك"}</b><small class="muted">ابدأ ختمة ويُقسَّم لك الورد على الأيام</small></div></div>
    <div class="wd-act"><button class="btn pri sm" data-act="wdOpen" data-p="${last||1}">${last?"تابع القراءة":"افتح المصحف"}</button><button class="btn sm" data-act="wdKh">ابدأ ختمة</button></div></section>`}
/* --- خريطة الأخطاء --- */
function errCard(sid,who){if(!Q){try{loadQuran()}catch(e){}return""}let M={};try{M=heatMap(sid)}catch(e){return""}const V=Object.values(M);if(!V.length)return"";
  const t=V.reduce((a,o)=>a+o.t,0),l=V.reduce((a,o)=>a+o.l,0);const P=heatPages(M).slice(0,4);const c=cfg();const showW=who==="parent"?c.parentSeeNotes:who==="student"?c.studentSeeNotes:true;
  const W=showW?V.filter(o=>o.n>1).sort((a,b)=>b.n-a.n).slice(0,3):[];
  return `<section class="card em-card"><div class="card-h"><h2>${who==="parent"?"أخطاء التسميع":"خريطة أخطائي"}</h2><span class="pill">${V.length} موضع</span></div>
  <div class="em-sum"><span class="em-t"><i></i>تنبيه <b class="num">${t}</b></span><span class="em-l"><i></i>تلقين <b class="num">${l}</b></span></div>
  <div class="em-pages"><span class="small muted">راجع أولاً:</span>${P.map(([p,n])=>`<button class="chip-b" data-act="errGo" data-id="${sid}" data-p="${p}">ص ${p} <span class="num">(${n})</span></button>`).join("")}</div>
  ${W.length?`<div class="em-words">${W.map(o=>{const[si,a]=sa(o.g);return `<button class="em-w" data-act="errGo" data-id="${sid}" data-p="${pageOf(o.g)}"><b class="qtxt">${esc(o.word||(typeof wtext==="function"?wtext(o.g,o.w):"")||"")}</b><small>${esc(Q.s[si][0])} ${a}</small><em class="num">×${o.n}</em></button>`}).join("")}</div>`:""}
  <button class="btn sm em-go" data-act="errGo" data-id="${sid}" data-p="${P[0]?P[0][0]:1}">اعرضها على المصحف</button></section>`}
/* --- سلسلة الإنجاز --- */
const STK_MIL=[[3,"سلسلة إنجاز"],[7,"سلسلة ذهبية"],[14,"أسبوعان من المواظبة"],[30,"شهر من المواظبة"],[60,"سلسلة ماسية"],[100,"مئة يوم"],[200,"مئتا يوم"],[365,"عام من المواظبة"]];
const STKC={};
function streakInfo(sid){const d0=today();const T=S.tasks.filter(t=>t.studentId===sid);const R=(S.recits||[]).filter(r=>r.kind==="self"&&r.studentId===sid);const key=d0+"|"+T.length+"|"+T.filter(t=>t.done).length+"|"+R.length;if(STKC[sid]&&STKC[sid].key===key)return STKC[sid].v;
  const by={};T.forEach(t=>{(by[t.date]=by[t.date]||[]).push(t)});const sw=new Set(R.map(r=>String(r.createdAt||r.at||"").slice(0,10)));
  const st=d=>{const L=by[d];if(sw.has(d))return"ok";if(L&&L.length)return L.every(t=>t.done)?"ok":"miss";return"rest"};
  let cur=0,run=0,best=0,broken=false;let d=d0;const days=[];
  for(let i=0;i<400;i++){const s=st(d);if(i<7)days.push([d,i===0&&s==="miss"?"todo":s]);
    if(s==="ok"){run++;if(!broken)cur++}else if(s==="miss"){if(i===0){}else{broken=true;best=Math.max(best,run);run=0}}d=addDays(d,-1)}
  best=Math.max(best,run,cur);const v={cur,best,days:days.reverse()};STKC[sid]={key,v};return v}
streak=function(sid){try{return streakInfo(sid).cur}catch(e){return 0}};
{const _bd=badges;badges=function(sid){const b=_bd(sid);try{const si=streakInfo(sid);const hi=STK_MIL.filter(([n])=>n>=14&&si.best>=n).pop();if(hi)b.push([hi[1],`أطول سلسلة: ${si.best} يوماً متتالياً`])}catch(e){}return b}}
function streakCard(sid,self){const si=streakInfo(sid);const nx=STK_MIL.find(([n])=>n>si.cur);const pv=[...STK_MIL].reverse().find(([n])=>n<=si.cur);const base=pv?pv[0]:0;const pct=nx?Math.round((si.cur-base)/(nx[0]-base)*100):100;
  const DN=["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"];
  return `<section class="card sk-card ${si.cur?"on":""}"><div class="card-h"><h2>سلسلة الإنجاز</h2>${si.best?`<span class="pill">الأفضل ${si.best}</span>`:""}</div>
  <div class="sk-main"><span class="sk-fl" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2c1 3.5 4.5 5.6 4.5 10a4.5 4.5 0 0 1-9 0c0-2 .9-3.4 2-4.5.2 1.6 1 2.6 2 3 0-3.2-.6-5.8.5-8.5z"/></svg></span><b class="num">${si.cur}</b><span>${si.cur===1?"يوم":si.cur>=3&&si.cur<=10?"أيام":"يوماً"} متتالية</span></div>
  <div class="sk-days">${si.days.map(([d,s])=>`<span class="sk-d ${s}" title="${fmtShort(d)}"><i>${s==="ok"?"✓":s==="miss"?"✕":""}</i><small>${DN[dow(d)]}</small></span>`).join("")}</div>
  ${nx?`<div class="sk-nx"><div class="wd-bar"><i style="width:${pct}%"></i></div><small class="muted">${nx[0]-si.cur} ${self?"أيام وتنال":"أيام وينال"} وسام «${nx[1]}»</small></div>`:""}
  <p class="small muted sk-h">${self?"أنجز كل مهام يومك أو سجّل وردك لتستمر السلسلة":"تستمر بإنجاز مهام اليوم كاملة أو تسجيل الورد"}</p></section>`}
/* --- تجميع إضافات الواجهة --- */
function homeExtras(g,m,B){try{B.wird=wirdCard()}catch(e){}
  const sid=g==="student"?m.id:g==="parent"?ui.kid:null;if(sid){try{B.errmap=errCard(sid,g)}catch(e){}try{B.streak=streakCard(sid,g==="student")}catch(e){}}
  if(g==="student"){try{const c=streakInfo(m.id).cur;const hit=STK_MIL.find(([n])=>n===c);const k="skcel:"+m.id;if(hit&&zls.get(k,"")!==c+"|"+today()&&XW.cel!==c){XW.cel=c;zls.set(k,c+"|"+today());setTimeout(()=>celebrate(`${c} أيام متتالية — ${hit[1]}`),400)}}catch(e){}}
  Object.keys(B).forEach(k=>{if(B[k]==null||!String(B[k]).trim())delete B[k]})}
/* --- المجموعات (ودجات فوق بعض تتقلب بالسحب) --- */
function hbStackOut(sg){if(sg.c.length<2)return sg.h;const fx=sg.hh&&!sg.szc;
  return `<div class="hb hb-stack ${sg.szc?"hb-sz hb-sz-"+sg.szc:""} ${fx?"hb-fix":""}" data-hk="${esc(sg.k)}" data-g="${sg.g}" style="--span:${sg.sp};${fx?`--hh:${sg.hh}px;`:""}"><div class="stk-track">${sg.c.map(c=>`<div class="stk-pg">${c}</div>`).join("")}</div><div class="stk-dots" aria-hidden="true">${sg.c.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div></div>`}
document.addEventListener("scroll",e=>{const t=e.target;if(!t||!t.classList||!t.classList.contains("stk-track"))return;const i=Math.round(Math.abs(t.scrollLeft)/Math.max(1,t.clientWidth));const d=t.parentElement.querySelector(".stk-dots");if(d)[...d.children].forEach((x,j)=>x.classList.toggle("on",j===i))},true);
/* --- قوالب الواجهة --- */
const HB_TPL={student:[["min","مختصر","الأهم فقط",["hero","wird","zadpray","tasks","streak"]],["hifz","الحفظ والتسميع","للتركيز على الورد والأخطاء",["hero","wird","tasks","errmap","next","goal","streak","msg"]],["wid","ودجات","مربعات بأحجام آبل",["hero","zadpray:m","wird:s","streak:s","tasks","errmap:s","board:s","next","goal","badges"]]],
  parent:[["min","مختصر","الأهم فقط",["kids","hero","week","next","msg"]],["wid","ودجات","مربعات بأحجام آبل",["kids","hero","zadpray:m","streak:s","errmap:s","week","next","msg","report"]]],
  staff:[["min","مختصر","الأهم فقط",["hero","stats","pending","sessions","zadpray:m"]],["fol","المتابعة","لمتابعة الطلاب والتسميع",["hero","pending","recits","alerts","students","sessions","board"]]]};
const hbTplSaved=g=>(((uiCfg().homeTpl)||{})[g])||[];
function hbTplModal(g){const L=HB_TPL[g]||[];const S2=hbTplSaved(g);const nm=k=>(HOME_BLOCKS[g].find(x=>x[0]===k.split(":")[0])||[,k])[1];
  openModal("قوالب الواجهة",`<p class="hint">اختر قالباً يُطبَّق على ترتيب الصفحة وأحجامها، وتقدر تعدّل بعده براحتك. الأقسام غير الموجودة في القالب تُخفى ولا تُحذف.</p>
  <div class="tpl-g"><button type="button" class="tpl" data-act="hbTplUse" data-g="${g}" data-id="b:all"><b>الكل</b><small>كل الأقسام بالترتيب الافتراضي</small></button>${L.map(([id,n,h,ks])=>`<button type="button" class="tpl" data-act="hbTplUse" data-g="${g}" data-id="b:${id}"><b>${n}</b><small>${h}</small><em>${ks.map(nm).map(esc).join(" · ")}</em></button>`).join("")}</div>
  ${S2.length?`<h4 class="tpl-h">قوالبك المحفوظة</h4><div class="tpl-g">${S2.map(t=>`<div class="tpl tpl-s"><button type="button" data-act="hbTplUse" data-g="${g}" data-id="${esc(t.id)}"><b>${esc(t.n)}</b><small>${t.items.filter(x=>!x.h).length} قسماً ظاهراً</small></button><button type="button" class="btn sm ghost" data-act="hbTplDel" data-g="${g}" data-id="${esc(t.id)}" aria-label="حذف القالب">🗑</button></div>`).join("")}</div>`:""}
  <h4 class="tpl-h">احفظ الترتيب الحالي كقالب</h4>${fld("اسم القالب",inp("n","","text","maxlength='30' placeholder='مثال: ترتيب رمضان'"))}`,"hbTplSave",{g},"حفظ القالب")}
function hbTplApply(g,id){const cur=homeOrder(g);let arr;
  if(id==="b:all")arr=HOME_BLOCKS[g].map(([k])=>({k})).concat(cur.filter(x=>x.k.startsWith("cx:")).map(x=>({k:x.k,h:x.h})));
  else if(id.startsWith("b:")){const t=(HB_TPL[g]||[]).find(x=>x[0]===id.slice(2));if(!t)return;const ks=t[3].map(s=>s.split(":"));const set=new Set(ks.map(x=>x[0]));arr=ks.filter(([k])=>cur.some(x=>x.k===k)).map(([k,sz])=>({k,...(sz?{sz}:{})})).concat(cur.filter(x=>!set.has(x.k)).map(x=>({k:x.k,h:true})))}
  else{const t=hbTplSaved(g).find(x=>x.id===id);if(!t)return;const set=new Set(t.items.map(x=>x.k));arr=t.items.filter(x=>cur.some(y=>y.k===x.k)).map(x=>({...x})).concat(cur.filter(x=>!set.has(x.k)).map(x=>({k:x.k,h:true})))}
  saveHome(g,arr);closeModal();toast("طُبّق القالب — اضغط «حفظ التعديلات» لاعتماده")}
FORMS.hbTplSave=fd=>{if(!isDir())return;const g=modalCtx.g;const n=String(fd.get("n")||"").trim().slice(0,30);if(!n){toast("اكتب اسم القالب","err");throw new Error("اختر")}
  const items=homeOrder(g).map(x=>({k:x.k,...(x.h?{h:true}:{}),...(x.w?{w:x.w}:{}),...(x.hh?{hh:x.hh}:{}),...(x.sz?{sz:x.sz}:{}),...(x.st?{st:true}:{})}));const all={...(uiCfg().homeTpl||{})};all[g]=[...hbTplSaved(g),{id:"t"+Date.now().toString(36),n,items}].slice(-12);saveUi({homeTpl:all});toast("حُفظ القالب")};
/* --- وضع الحفظ في المصحف: إخفاء الكلمات وإظهارها باللمس --- */
RD.memLv=zls.get("rmemlv","all");const MEM_LV=[["all","الكل"],["first","أوائل الآيات"],["alt","بالتناوب"]];
function rMemApply(o){if(!RD.mem){o.querySelectorAll(".mh,.mrv").forEach(w=>w.classList.remove("mh","mrv"));return}const rv=RD.memRv||(RD.memRv=new Set());const lv=RD.memLv||"all";
  o.querySelectorAll(".rd-stage .mushaf .w,.rd-stage [data-rk]").forEach((w,ix)=>{const key=w.dataset.rk||("e"+ix);w.dataset.mk=key;const[g,wi]=w.dataset.rk?w.dataset.rk.split(":").map(Number):[-1,ix];const hide=lv==="all"||(lv==="first"&&wi>0)||(lv==="alt"&&wi%2===1);const r=rv.has(key);w.classList.toggle("mh",hide&&!r);w.classList.toggle("mrv",hide&&r)})}
function rMemTap(w){const rv=RD.memRv||(RD.memRv=new Set());const k=w.dataset.mk||w.dataset.rk;if(!k)return;if(w.classList.contains("mh")){rv.add(k);w.classList.remove("mh");w.classList.add("mrv")}else if(w.classList.contains("mrv")){rv.delete(k);w.classList.remove("mrv");w.classList.add("mh")}}
function rMemBar(){const lv=RD.memLv||"all";return `<div class="rd-membar" role="toolbar" aria-label="وضع الحفظ"><span class="mb-t">وضع الحفظ</span><div class="rd-seg">${MEM_LV.map(([k,l])=>`<button class="${lv===k?"on":""}" data-ract="memLv" data-v="${k}">${l}</button>`).join("")}</div><button class="rd-pill" data-ract="memShow">${RD.memRv&&RD.memRv.size?"إخفاء":"إظهار"}</button><button class="rd-ic" data-ract="memTg" aria-label="إيقاف وضع الحفظ">${zSV('<path d="M6 6l12 12M18 6L6 18"/>')}</button></div>`}
Object.assign(RACT,{memTg:()=>{RD.mem=!RD.mem;RD.memRv=new Set();if(RD.mem){RD.sheet=null;RD.chrome=true;toast("المس أي كلمة لإظهارها")}rRender(true)},
  memLv:v=>{RD.memLv=v;RD.memRv=new Set();zls.set("rmemlv",v);rRender(true)},
  memShow:()=>{if(RD.memRv&&RD.memRv.size)RD.memRv=new Set();else{RD.memRv=new Set();document.querySelectorAll("#mreader .rd-stage .mushaf .w,#mreader .rd-stage [data-rk]").forEach((w,ix)=>RD.memRv.add(w.dataset.rk||("e"+ix)))}rMemApply(document.getElementById("mreader"));const b=document.querySelector('#mreader [data-ract="memShow"]');if(b)b.textContent=RD.memRv.size?"إخفاء":"إظهار"}});
/* --- الأوامر --- */
const dirOnly=f=>el=>{if(!isDir())return;return f(el)};
Object.assign(A,{
  wdOpen:el=>rOpen(+el.dataset.p||1),
  wdKh:()=>{rOpen(+zls.get("rlast",0)||1);let n=0;const w=()=>{if(RD.on){RD.sheet="kh";rRender()}else if(n++<40)setTimeout(w,150)};setTimeout(w,60)},
  wdDone:el=>{const K=zls.get("rk:"+rU(),null);if(!K)return;const v=el.dataset.v;if(K.done[v])delete K.done[v];else{K.done[v]=1;celebrate("أتممت ورد اليوم، بارك الله فيك")}zls.set("rk:"+rU(),K);try{rdPush()}catch(e){}render()},
  errGo:el=>{const sid=el.dataset.id;ui.mheat=sid;ui.tasmee=false;ui.mpage=+el.dataset.p||1;go("mushaf")},
  wkShare:el=>wkShare(el.dataset.id),wkImg:el=>wkImg(el.dataset.id),
  hbStk:dirOnly(el=>{const g=el.dataset.g;const items=homeOrder(g);const i=items.findIndex(y=>y.k===el.dataset.k);if(i<1){toast("ما قبله مربع يندمج معه","err");return}const x=items[i];x.st=!x.st;hbSave(g,items);toast(x.st?"دُمج مع المربع السابق: اسحب يميناً ويساراً للتقليب بينهما":"فُصل عن المجموعة")}),
  hbTpl:dirOnly(el=>hbTplModal(el.dataset.g)),
  hbTplUse:dirOnly(el=>hbTplApply(el.dataset.g,el.dataset.id)),
  hbTplDel:dirOnly(el=>{if(!el.dataset.ok){el.dataset.ok=1;el.textContent="تأكيد؟";return}const g=el.dataset.g;const all={...(uiCfg().homeTpl||{})};all[g]=hbTplSaved(g).filter(t=>t.id!==el.dataset.id);saveUi({homeTpl:all});hbTplModal(g)})});
/* --- التقرير الأسبوعي: مشاركة نصاً أو صورة، وإرسال تلقائي --- */
function wkShare(sid){const s=get("members",sid);if(!s)return;const t=weekText(s);if(navigator.share){navigator.share({text:t}).catch(()=>{})}else{try{navigator.clipboard.writeText(t);toast("نُسخ الملخص، الصقه في واتساب أو أي مكان")}catch(e){}}}
function wkImg(sid){const s=get("members",sid);if(!s)return;const w=weekSummary(s),x=w.x;const att=x.att.present+x.att.late,cnt=att+x.att.absent;let si={cur:0};try{si=streakInfo(sid)}catch(e){}
  const W=1080,Hh=1350;const cv=document.createElement("canvas");cv.width=W;cv.height=Hh;const c=cv.getContext("2d");const css=getComputedStyle(document.documentElement);const col=(v,d)=>(css.getPropertyValue(v)||"").trim()||d;
  const pri=col("--primary","#1f3559"),acc=col("--accent","#2bb3c0");const F='-apple-system,"SF Arabic","SF Pro Display","Segoe UI",Tahoma,sans-serif';
  const gr=c.createLinearGradient(0,0,W,Hh);gr.addColorStop(0,pri);gr.addColorStop(1,acc);c.fillStyle=gr;c.fillRect(0,0,W,Hh);
  c.direction="rtl";c.textAlign="right";c.fillStyle="#fff";c.font=`600 38px ${F}`;c.globalAlpha=.85;c.fillText(cfg().circleName||"مَعين",W-80,120);c.globalAlpha=1;
  c.font=`800 72px ${F}`;c.fillText("ملخص الأسبوع",W-80,220);c.font=`700 52px ${F}`;c.fillText(s.name,W-80,300);c.font=`500 34px ${F}`;c.globalAlpha=.85;c.fillText(`${fmtShort(w.f)} ← ${fmtShort(w.t)}`,W-80,355);c.globalAlpha=1;
  const T=[[cnt?att+"/"+cnt:"—","أيام الحضور"],[x.tasks?x.done+"/"+x.tasks:"—","المهام المنجزة"],[String(w.pages),s.track==="tilawa"?"أوجه مقروءة":"أوجه محفوظة"],[String(si.cur),"أيام متتالية"]];
  const rr=(X,Y,w2,h2,r)=>{c.beginPath();c.moveTo(X+r,Y);c.arcTo(X+w2,Y,X+w2,Y+h2,r);c.arcTo(X+w2,Y+h2,X,Y+h2,r);c.arcTo(X,Y+h2,X,Y,r);c.arcTo(X,Y,X+w2,Y,r);c.closePath()};
  T.forEach(([v,l],i)=>{const cx=i%2,cy=Math.floor(i/2);const X=W-80-(cx+1)*450-cx*20,Y=420+cy*250;c.fillStyle="rgba(255,255,255,.16)";rr(X,Y,450,220,36);c.fill();c.fillStyle="#fff";c.textAlign="center";c.font=`800 86px ${F}`;c.fillText(v,X+225,Y+120);c.font=`500 34px ${F}`;c.globalAlpha=.9;c.fillText(l,X+225,Y+180);c.globalAlpha=1;c.textAlign="right"});
  let y=960;c.font=`600 36px ${F}`;c.fillText(`التنبيهات: ${x.errT}   ·   التلقين: ${x.errL}`,W-80,y);y+=70;
  const notes=w.notes.slice(-2);if(notes.length){c.font=`700 38px ${F}`;c.fillText("ملاحظة المعلم",W-80,y);y+=56;c.font=`500 34px ${F}`;notes.forEach(([d,n])=>{let line="";String(n).split(/\s+/).forEach(wd=>{const t2=line?line+" "+wd:wd;if(c.measureText(t2).width>W-160){if(y<Hh-110){c.fillText(line,W-80,y);y+=48}line=wd}else line=t2});if(line&&y<Hh-110){c.fillText(line,W-80,y);y+=58}})}
  c.font=`500 28px ${F}`;c.globalAlpha=.7;c.textAlign="center";c.fillText("quran.maeen.com.sa",W/2,Hh-50);c.globalAlpha=1;
  cv.toBlob(b=>{if(!b)return;const f=new File([b],`ملخص-${s.name}.png`,{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"ملخص الأسبوع"}).catch(()=>{})}else{const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}},"image/png")}
CH.weekAuto=el=>{if(!isDir())return;const cur=get("config","main")||{};put("config","main",{...DEF_CFG,...cur,weekAuto:el.checked});toast(el.checked?"سيُرسل ملخص الأسبوع لأولياء الأمور تلقائياً كل خميس":"أُوقف الإرسال التلقائي")};
function weekAutoTick(m){try{if(MODE!=="live"||!isStaff(m)||!cfg().weekAuto)return;const d=today();const wd=dow(d);if(wd<4)return;const wk=addDays(d,-wd);const k="wkSent:"+m.id;if(zls.get(k,"")===wk||XW.wk===wk)return;if(!Array.isArray(S.messages))return;XW.wk=wk;
  const since=new Date(wk+"T00:00:00").toISOString();let n=0;S.members.filter(s=>s.role==="student"&&s.status==="active"&&s.teacherId===m.id).forEach(s=>S.members.filter(p=>p.role==="parent"&&p.status==="active"&&(p.childIds||[]).includes(s.id)).forEach(p=>{const sent=msgsOf().some(z=>z.fromId===m.id&&z.toId===p.id&&String(z.body||"").startsWith("ملخص أسبوع "+s.name)&&String(z.at||"")>=since);if(!sent&&sendMsg(p.id,weekText(s),s.id))n++}));
  zls.set(k,wk);if(n)toast(`أُرسل ملخص الأسبوع تلقائياً إلى ${n} من أولياء الأمور`)}catch(e){}}
/* --- التذكيرات: قبل الأذان وعنده، وقبل الحلقة، ووقت الورد --- */
const nPref=m=>({pr:10,pa:true,ci:15,wd:"20:00",...zls.get("npref:"+((m&&m.id)||"x"),{})});
function nPrefsHTML(m){const p=nPref(m);const o=(L,v)=>L.map(([k,l])=>`<option value="${k}" ${String(k)===String(v)?"selected":""}>${l}</option>`).join("");const mins=[0,5,10,15,20,30].map(n=>[n,n?`قبلها بـ ${n} دقيقة`:"بدون"]);
  return `<div class="npref"><label><span>تذكير قبل الصلاة</span><select data-change="nPref" data-k="pr">${o(mins,p.pr)}</select></label>
  <label><span>تنبيه عند الأذان</span><select data-change="nPref" data-k="pa">${o([[1,"مفعّل"],[0,"بدون"]],p.pa?1:0)}</select></label>
  <label><span>تذكير قبل الحلقة</span><select data-change="nPref" data-k="ci">${o([0,10,15,30,60].map(n=>[n,n?`قبلها بـ ${n} دقيقة`:"بدون"]),p.ci)}</select></label>
  ${m.role==="student"?`<label><span>تذكير الورد والسلسلة</span><select data-change="nPref" data-k="wd">${o([["off","بدون"],...["16:00","17:00","18:00","19:00","20:00","21:00","22:00"].map(t=>[t,"الساعة "+t])],p.wd)}</select></label>`:""}</div>`}
CH.nPref=el=>{const m=me();if(!m)return;const p=zls.get("npref:"+m.id,{});const k=el.dataset.k;let v=el.value;if(k==="pr"||k==="ci")v=+v;if(k==="pa")v=v==="1";p[k]=v;zls.set("npref:"+m.id,p);Object.keys(NOTIF.timers).forEach(t=>{if(/^(p|c|wird)-/.test(t)){clearTimeout(NOTIF.timers[t]);delete NOTIF.timers[t]}});XW.nt=0;try{notifTick(m)}catch(e){}toast("حُفظ التذكير")};
{const _n=notify;notify=function(title,body,tag){if(!notifOn())return;try{if(navigator.serviceWorker&&navigator.serviceWorker.controller){navigator.serviceWorker.ready.then(r=>r.showNotification(title,{body,tag,icon:"icon-192.png",badge:"icon-192.png",lang:"ar",dir:"rtl"})).catch(()=>_n(title,body,tag));return}}catch(e){}_n(title,body,tag)}}
function remindTick(m){if(!notifOn()||MODE==="demo")return;const now=Date.now();if(XW.nt&&now-XW.nt<60000)return;XW.nt=now;const p=nPref(m);const d=today();const at=(hm,before)=>{const[h,mi]=String(hm).split(":").map(Number);const t=new Date();t.setHours(h,mi,0,0);return t.getTime()-before*60000};
  const set=(k,ms,fn)=>{if(NOTIF.timers[k]||ms<=now||ms-now>13*36e5)return;NOTIF.timers[k]=setTimeout(fn,ms-now)};
  try{if(!(ZST.pt&&ZST.pt.times))zLoadPT();const P=ZST.pt&&ZST.pt.times;if(P)ZFARD.forEach(([k,l])=>{if(!P[k])return;if(p.pr)set(`p-${d}-${k}-b`,at(P[k],p.pr),()=>notify(`صلاة ${l} بعد ${p.pr} دقائق`,`الأذان الساعة ${P[k]}`,`p-${k}`));if(p.pa)set(`p-${d}-${k}-a`,at(P[k],0),()=>notify(`حان الآن وقت صلاة ${l}`,"«أرحنا بها يا بلال»",`p-${k}`))})}catch(e){}
  if(p.ci){try{const C=m.role==="student"?[get("circles",m.circleId)]:m.role==="parent"?parentKids(m).map(s=>get("circles",s.circleId)):S.circles.filter(c=>c.teacherId===m.id);const seen=new Set();C.filter(c=>c&&hasTime(c)&&!seen.has(c.id)&&seen.add(c.id)).forEach(c=>{if(!(c.days||[]).includes(dow(d)))return;set(`c-${d}-${c.id}`,at(c.time,p.ci),()=>notify(`${c.name}: تبدأ الحلقة بعد ${p.ci} دقيقة`,`الساعة ${c.time}${c.meetLink?" · رابط الدخول في المنصة":""}`,`c-${c.id}`))})}catch(e){}}}
{const _t=notifTick;notifTick=function(m){if(m&&m.role==="student"&&nPref(m).wd==="off"){NOTIF.timers["wird-"+today()]=NOTIF.timers["wird-"+today()]||-1}_t(m);try{weekAutoTick(m)}catch(e){}try{if(m&&m.status==="active")remindTick(m)}catch(e){}}}

boot();

