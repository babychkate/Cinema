using Cinema.Models;
using Microsoft.AspNetCore.Identity;

namespace Cinema.Data
{
    public class AdminData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Перевірка, чи існує роль "Admin", якщо ні - створюємо
            var roleExists = await roleManager.RoleExistsAsync("Admin");
            if (!roleExists)
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            // Перевірка, чи існує роль "User", якщо ні - створюємо
            roleExists = await roleManager.RoleExistsAsync("User");
            if (!roleExists)
            {
                await roleManager.CreateAsync(new IdentityRole("User"));
            }

            // Перевірка, чи існує адміністратор
            var katya = await userManager.FindByNameAsync("admin");
            if (katya == null)
            {
                katya = new User
                {
                    UserName = "Katya",
                    Email = "katyaAdmin@gmail.com",
                    Role = "Admin",
                    Password = "slay!Kat976",
                    Age = 19
                };

                var result = await userManager.CreateAsync(katya, "slay!Kat976");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(katya, "Admin");
                }
            }

            var roksolana = await userManager.FindByNameAsync("admin2");
            if (roksolana == null)
            {
                roksolana = new User
                {
                    UserName = "Roksolana",
                    Email = "roksolanaAdmin@gmail.com",
                    Role = "Admin",
                    Password = "aha!Rok234",
                    Age = 18
                };

                var result2 = await userManager.CreateAsync(roksolana, "aha!Rok234");
                if (result2.Succeeded)
                {
                    await userManager.AddToRoleAsync(roksolana, "Admin");
                }
            }

            var yarik = await userManager.FindByNameAsync("admin3");
            if (yarik == null)
            {
                yarik = new User
                {
                    UserName = "Yarik",
                    Email = "yarikAdmin@gmail.com",
                    Role = "Admin",
                    Password = "syaduuu!Yar716",
                    Age = 19
                };

                var result3 = await userManager.CreateAsync(yarik, "syaduuu!Yar716");
                if (result3.Succeeded)
                {
                    await userManager.AddToRoleAsync(yarik, "Admin");
                }
            }

        }
    }
}
