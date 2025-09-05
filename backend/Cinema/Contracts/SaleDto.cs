using Cinema.Enums;
using System.Runtime.Serialization;

namespace Cinema.Contracts
{
    public class SaleDto
    {
        public decimal Discount { get; set; }
        public string Description { get; set; }

        public ForWhatType ForWhat { get; set; }
        public DiscountType DiscountType { get; set; }
    }
}
