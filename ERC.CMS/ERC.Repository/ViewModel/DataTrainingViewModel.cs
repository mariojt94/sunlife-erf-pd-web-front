using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class DataTrainingViewModel
    {
        public int ID { get; set; }
        public string LoginName { get; set; }
        public string VenueTraining { get; set; }
        public DateTime TrainingDate { get; set; }
    }
}
