using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cinema.Migrations
{
    /// <inheritdoc />
    public partial class ChangedrelashionshipsSnackUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Snacks_AspNetUsers_UserId",
                table: "Snacks");

            migrationBuilder.DropIndex(
                name: "IX_Snacks_UserId",
                table: "Snacks");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Snacks");

            migrationBuilder.CreateTable(
                name: "SnackUser",
                columns: table => new
                {
                    SnacksId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsersId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SnackUser", x => new { x.SnacksId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_SnackUser_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SnackUser_Snacks_SnacksId",
                        column: x => x.SnacksId,
                        principalTable: "Snacks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SnackUser_UsersId",
                table: "SnackUser",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SnackUser");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Snacks",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Snacks_UserId",
                table: "Snacks",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Snacks_AspNetUsers_UserId",
                table: "Snacks",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
