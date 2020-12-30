const timezones = [
    {
      "offset": "GMT-12:00",
      "name": "Etc/GMT-12",
      "offsetValue": -12,
    },
    {
      "offset": "GMT-11:00",
      "name": "Pacific/Midway",
      "offsetValue": -11,
    },
    {
      "offset": "GMT-11:00",
      "name": "Etc/GMT-11",
      "offsetValue": -11,
    },  
    {
      "offset": "GMT-10:00",
      "name": "America/Adak",
      "offsetValue": -10,
    },
    {
      "offset": "GMT-09:00",
      "name": "America/Anchorage",
      "offsetValue": -9,
    },
    {
      "offset": "GMT-09:00",
      "name": "Pacific/Gambier",
      "offsetValue": -9,
    },
    {
      "offset": "GMT-08:00",
      "name": "America/Los_Angeles",
      "offsetValue": -8,
    },
    {
      "offset": "GMT-08:00",
      "name": "America/Dawson_Creek",
      "offsetValue": -8,
    },
    {
      "offset": "GMT-08:00",
      "name": "America/Ensenada",
      "offsetValue": -8,
    },
    {
      "offset": "GMT-07:00",
      "name": "America/Denver",
      "offsetValue": -7,
    },
    {
      "offset": "GMT-07:00",
      "name": "America/Chihuahua",
      "offsetValue": -7,
    },
    {
      "offset": "GMT-06:00",
      "name": "America/Chicago",
      "offsetValue": -6,
    },
    {
      "offset": "GMT-06:00",
      "name": "America/Belize",
      "offsetValue": -6,
    },
    {
      "offset": "GMT-06:00",
      "name": "America/Cancun",
      "offsetValue": -6,
    },
    {
      "offset": "GMT-06:00",
      "name": "Chile/EasterIsland",
      "offsetValue": -6,
    },
    {
      "offset": "GMT-05:00",
      "name": "America/New_York",
      "offsetValue": -5,
    },
    {
      "offset": "GMT-05:00",
      "name": "America/Bogota",
      "offsetValue": -5,
    },
    {
      "offset": "GMT-05:00",
      "name": "America/Havana",
      "offsetValue": -5,
    },
    {
      "offset": "GMT-04:30",
      "name": "America/Caracas",
      "offsetValue": -4.5,
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Santiago",
      "offsetValue": -4,
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Campo_Grande",
      "offsetValue": -4,
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Glace_Bay",
      "offsetValue": -4,
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Goose_Bay",
      "offsetValue": -4,
    },
    {
      "offset": "GMT-04:00",
      "name": "America/La_Paz",
      "offsetValue": -4,
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Sao_Paulo",
      "offsetValue": -3,
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Argentina/Buenos_Aires",
      "offsetValue": -3,
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Montevideo",
      "offsetValue": -3,
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Araguaina",
      "offsetValue": -3,
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Godthab",
      "offsetValue": -3,
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Miquelon",
      "offsetValue": -3,
    }, 
    {
      "offset": "GMT-03:30",
      "name": "America/St_Johns",
      "offsetValue": -3.5,
    },
    {
      "offset": "GMT-02:00",
      "name": "America/Noronha",
      "offsetValue": -2,
    },
    {
      "offset": "GMT-01:00",
      "name": "Atlantic/Cape_Verde",
      "offsetValue": -1,
    },
    {
      "offset": "GMT",
      "name": "Europe/London",
      "offsetValue": 0,
    },
    {
      "offset": "GMT",
      "name": "Europe/Belfast",
      "offsetValue": 0,
    },
    {
      "offset": "GMT",
      "name": "Africa/Abidjan",
      "offsetValue": 0,
    },
    {
      "offset": "GMT",
      "name": "Europe/Dublin",
      "offsetValue": 0,
    },
    {
      "offset": "GMT",
      "name": "Europe/Lisbon",
      "offsetValue": 0,
    },
    {
      "offset": "UTC",
      "name": "UTC",
      "offsetValue": 0,
    },
    {
      "offset": "GMT+01:00",
      "name": "Europe/Amsterdam",
      "offsetValue": 1,
    },
    {
      "offset": "GMT+01:00",
      "name": "Africa/Algiers",
      "offsetValue": 1,
    },
    {
      "offset": "GMT+01:00",
      "name": "Africa/Windhoek",
      "offsetValue": 1,
    },
    {
      "offset": "GMT+01:00",
      "name": "Atlantic/Azores",
      "offsetValue": 1,
    },
    {
      "offset": "GMT+01:00",
      "name": "Atlantic/Stanley",
      "offsetValue": 1,
    },
    {
      "offset": "GMT+01:00",
      "name": "Europe/Belgrade",
      "offsetValue": 1,
    },
    {
      "offset": "GMT+01:00",
      "name": "Europe/Brussels",
      "offsetValue": 1,
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Jerusalem",
      "offsetValue": 2,
    },
    {
      "offset": "GMT+02:00",
      "name": "Africa/Cairo",
      "offsetValue": 2,
    },
    {
      "offset": "GMT+02:00",
      "name": "Africa/Blantyre",
      "offsetValue": 2,
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Beirut",
      "offsetValue": 2,
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Damascus",
      "offsetValue": 2,
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Gaza",
      "offsetValue": 2,
    },
    {
      "offset": "GMT+03:00",
      "name": "Africa/Addis_Ababa",
      "offsetValue": 3,
    },
    {
      "offset": "GMT+03:00",
      "name": "Asia/Riyadh89",
      "offsetValue": 3,
    },
    {
      "offset": "GMT+03:00",
      "name": "Europe/Minsk",
      "offsetValue": 3,
    },
    {
      "offset": "GMT+03:30",
      "name": "Asia/Tehran",
      "offsetValue": 3.5,
    },
    {
      "offset": "GMT+04:00",
      "name": "Europe/Moscow",
      "offsetValue": 4,
    },
    {
      "offset": "GMT+04:00",
      "name": "Asia/Dubai",
      "offsetValue": 4,
    },
    {
      "offset": "GMT+04:00",
      "name": "Asia/Yerevan",
      "offsetValue": 4,
    },
    {
      "offset": "GMT+04:30",
      "name": "Asia/Kabul",
      "offsetValue": 4.5,
    },
    {
      "offset": "GMT+05:00",
      "name": "Asia/Tashkent",
      "offsetValue": 5,
    },
    {
      "offset": "GMT+05:30",
      "name": "Asia/Kolkata",
      "offsetValue": 5.5,
    },
    {
      "offset": "GMT+05:45",
      "name": "Asia/Katmandu",
      "offsetValue": 5.75,
    },
    {
      "offset": "GMT+06:00",
      "name": "Asia/Dhaka",
      "offsetValue": 6,
    },
    {
      "offset": "GMT+06:00",
      "name": "Asia/Yekaterinburg",
      "offsetValue": 6,
    },
    {
      "offset": "GMT+06:30",
      "name": "Asia/Rangoon",
      "offsetValue": 6.5,
    },
    {
      "offset": "GMT+07:00",
      "name": "Asia/Bangkok",
      "offsetValue": 7,
    },
    {
      "offset": "GMT+07:00",
      "name": "Asia/Novosibirsk",
      "offsetValue": 7,
    },
    {
      "offset": "GMT+08:00",
      "name": "Asia/Hong_Kong",
      "offsetValue": 8,
    },
    {
      "offset": "GMT+08:00",
      "name": "Etc/GMT+8",
      "offsetValue": 8,
    },
    {
      "offset": "GMT+08:00",
      "name": "Asia/Krasnoyarsk",
      "offsetValue": 8,
    },
    {
      "offset": "GMT+08:00",
      "name": "Australia/Perth",
      "offsetValue": 8,
    },
    {
      "offset": "GMT+08:45",
      "name": "Australia/Eucla",
      "offsetValue": 8.75,
    },
    {
      "offset": "GMT+09:00",
      "name": "Asia/Tokyo",
      "offsetValue": 9,
    },
    {
      "offset": "GMT+09:00",
      "name": "Asia/Irkutsk",
      "offsetValue": 9,
    },
    {
      "offset": "GMT+09:00",
      "name": "Asia/Seoul",
      "offsetValue": 9,
    },
    {
      "offset": "GMT+09:30",
      "name": "Australia/Adelaide",
      "offsetValue": 9.5,
    },
    {
      "offset": "GMT+09:30",
      "name": "Australia/Darwin",
      "offsetValue": 9.5,
    },
    {
      "offset": "GMT+09:30",
      "name": "Pacific/Marquesas",
      "offsetValue": 9.5,
    },
    {
      "offset": "GMT+10:00",
      "name": "Australia/Brisbane",
      "offsetValue": 10,
    },
    {
      "offset": "GMT+10:00",
      "name": "Etc/GMT+10",
      "offsetValue": 10,
    },
    {
      "offset": "GMT+10:00",
      "name": "Australia/Hobart",
      "offsetValue": 10,
    },
    {
      "offset": "GMT+10:00",
      "name": "Asia/Yakutsk",
      "offsetValue": 10,
    },
    {
      "offset": "GMT+10:30",
      "name": "Australia/Lord_Howe",
      "offsetValue": 10.5,
    },
    {
      "offset": "GMT+11:00",
      "name": "Asia/Vladivostok",
      "offsetValue": 11,
    },
    {
      "offset": "GMT+11:30",
      "name": "Pacific/Norfolk",
      "offsetValue": 11.5,
    },
    {
      "offset": "GMT+12:00",
      "name": "Pacific/Auckland",
      "offsetValue": 12,
    },
    {
      "offset": "GMT+12:00",
      "name": "Etc/GMT+12",
      "offsetValue": 12,
    },
    {
      "offset": "GMT+12:00",
      "name": "Asia/Anadyr",
      "offsetValue": 12,
    },
    {
      "offset": "GMT+12:00",
      "name": "Asia/Magadan",
      "offsetValue": 12,
    },
    {
      "offset": "GMT+12:45",
      "name": "Pacific/Chatham",
      "offsetValue": 12.75,
    },
    {
      "offset": "GMT+13:00",
      "name": "Pacific/Tongatapu",
      "offsetValue": 13,
    },
    {
      "offset": "GMT+14:00",
      "name": "Pacific/Kiritimati",
      "offsetValue": 14,
    }
  ]

  export default timezones;