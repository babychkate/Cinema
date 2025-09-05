using Microsoft.EntityFrameworkCore.Migrations;
using Cinema.Enums;

#nullable disable

namespace Cinema.Migrations
{
    public partial class DiscountType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Додавання стовпця Discount_type до таблиці Sales
            migrationBuilder.AddColumn<string>(
                name: "Discount_type",
                table: "Sales",
                type: "nvarchar(max)",  // Визначення типу даних для Discount_type
                nullable: false,
                defaultValue: "Default"); // Ви можете встановити значення за замовчуванням, якщо це потрібно
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Видалення стовпця Discount_type, якщо міграцію відкатують
            migrationBuilder.DropColumn(
                name: "Discount_type",
                table: "Sales");
        }
    }
}
